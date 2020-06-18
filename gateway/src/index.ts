require('dotenv').config()

import { ApolloServer, makeExecutableSchema, mergeSchemas } from 'apollo-server'
import { GraphQLSchema } from 'graphql'
import { ConnectionContext } from 'subscriptions-transport-ws'
import typeDefs from './type_defs'
import resolvers from './resolvers'
import { verifyToken } from './util/auth'
import ws from 'ws'
import { createSchema } from './util/schema'

const clientMap = {}

export interface GatewayGameInfo {
  hostname: string
  prefix: string
}

export interface GatewayConfig {
  port?: number
  games: GatewayGameInfo[]
}

const closeClientConnections = (authToken) => {
  if (!clientMap[authToken]) {
    return
  }
  clientMap[authToken].forEach((v : ws) => {
    v.close()
  })
  delete clientMap[authToken]
}

const genSchema = async (games : GatewayGameInfo[]) : Promise<GraphQLSchema> => {
  const schemas : GraphQLSchema[] = []

  for (const game of games) {
    schemas.push(await createSchema(game.hostname, game.prefix, clientMap))
  }

  const authSchema = makeExecutableSchema({
    typeDefs,
    resolvers
  })

  schemas.push(authSchema)

  return mergeSchemas({
    schemas: schemas.filter((v) => !!v)
  })
}

export const listen = async (config : GatewayConfig) => {
  const server = new ApolloServer({
    schema: await genSchema(config.games),

    subscriptions: {
      onConnect: async (connectionParams : Object, websocket : ws, context : ConnectionContext) => {
        const authToken = connectionParams['authToken']
        if (!authToken || !verifyToken(authToken)) {
          // do not pass token, if bad
          return {}
        }
        closeClientConnections(authToken)
        return connectionParams
      },
      onDisconnect: async (websocket: ws, context: ConnectionContext) => {
        const ctx = await context.initPromise
        if (ctx && ctx.authToken && clientMap[ctx.authToken]) {
          closeClientConnections(ctx.authToken)
        }
      }
    },
    formatError: (err) => {
      if (err.extensions && err.extensions.code === 'INTERNAL_SERVER_ERROR') {
        console.error(new Date())
        console.error(err)
        console.error(err.originalError)
        return Object.assign({}, err, { message: 'Internal error' })
      }
      return err
    }
  })

  server.listen(config.port || 80)
}