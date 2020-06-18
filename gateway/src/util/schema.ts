import { createHttpLink } from 'apollo-link-http'
import { ApolloLink, split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import fetch from 'node-fetch'
import { onError } from 'apollo-link-error'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { makeRemoteExecutableSchema, introspectSchema } from 'apollo-server'
import ws from 'ws'
import { GraphQLSchema, GraphQLError } from 'graphql'
import { transformSchema, RenameTypes, RenameRootFields } from 'graphql-tools'

const createLink = (host : string, clientMap : object) => {
  // http link for non game requests
  const httpLink = createHttpLink({
    uri: `http://${host}/graphql`,
    // @ts-ignore
    fetch
  })

  // ws link for in game requests
  const wsLink = new ApolloLink((operation) => {
    const context = operation.getContext().graphqlContext

    // transfer auth token to link connectionParams
    let connectionParams = {}
    if (context && context.connection) {
      Object.assign(connectionParams, context.connection.context)
    }

    const client = new SubscriptionClient(`ws://${host}/graphql`, {
      connectionParams,
      reconnect: true
    }, ws)

    // add reference of ws link connection to map
    if (context && context.connection) {
      if (!clientMap[context.connection.context.authToken]) {
        clientMap[context.connection.context.authToken] = []
      }

      clientMap[context.connection.context.authToken].push(client)
    }
    return new WebSocketLink(client).request(operation)
  })

  const finalLink = split(
    (operation) => {
      const context = operation.getContext().graphqlContext
      // If we have a auth token, then go to websocket. Don't allow ws for clients without token
      if (context && context.connection && context.connection.context.authToken) {
        return true
      }
      return false
    },
    wsLink,
    httpLink
  )

  // Correct error handling for GraphQL errors
  return onError((err) => {
    if (!err.response) {
      return
    }
    // @ts-ignore
    err.response.errors = err.response.errors.map((err => new GraphQLError(err.message, null, null, err.locations, err.path, null, err.extensions)))
  }).concat(finalLink)
}

export const createSchema = async (host : string, prefix : string, clientMap : object) : Promise<GraphQLSchema> => {
  const link = createLink(host, clientMap)

  let schema
  try {
    schema = await introspectSchema(link)
  } catch (e) {
    // Could not get schema, microservice not available
    return null
  }

  const execSchema = makeRemoteExecutableSchema({
    schema,
    link
  })

  const prefixedSchema = transformSchema(execSchema, [
    new RenameTypes((name : string) => prefix + name),
    new RenameRootFields((operation, name) => {
      if (operation === 'Subscription') {
        return name
      }
      return prefix.toLowerCase() + name.substring(0, 1).toUpperCase() + name.substring(1)
    })
  ])

  return prefixedSchema
}