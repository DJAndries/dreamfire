import { ApolloServer, ServerInfo } from 'apollo-server'
import { SubscriptionServerOptions, Context } from 'apollo-server-core'
import { ApolloServerExpressConfig } from 'apollo-server-express'
import { ConnectionContext } from 'subscriptions-transport-ws'

import { tokenUserId } from './util/auth'
import { GraphQLError, GraphQLFormattedError } from 'graphql'

type DreamfireConfig = {
  onUserLeave: (userId : string) => void
  baseContext: Context
}

export default class DreamfireServer {
  apolloServer : ApolloServer

  onUserLeave : (userId : string) => void

  baseContext : Context

  constructor(config : ApolloServerExpressConfig & DreamfireConfig) {
    this.onUserLeave = config.onUserLeave
    this.baseContext = config.baseContext
    this.initConfig(config)
    this.apolloServer = new ApolloServer(config)
  }

  private initConfig(config : ApolloServerExpressConfig) {
    let subscriptions : Partial<SubscriptionServerOptions>
    if (!config.subscriptions || (typeof config.subscriptions === 'string')) {
      config.subscriptions = subscriptions = {}
    } else {
      config.subscriptions = subscriptions as Partial<SubscriptionServerOptions>
    }

    if (!config.subscriptions.onConnect) {
      subscriptions.onConnect = this.onConnect.bind(this)
    }

    if (!config.subscriptions.onDisconnect) {
      subscriptions.onDisconnect = this.onDisconnect.bind(this)
    }

    if (!config.formatError) {
      config.formatError = this.formatError.bind(this)
    }

    if (!config.context) {
      config.context = this.generateContext.bind(this)
    }

    if (config.introspection !== false) {
      config.introspection = true
    }
  }

  onConnect(connectionParams : Object) : object {
    const userId = tokenUserId(connectionParams['authToken'])

    return { userId }
  }

  async onDisconnect(webSocket : WebSocket, context : ConnectionContext) {
    const initCtx = await context.initPromise
    if (initCtx['userId']) {
      if (this.onUserLeave) {
        this.onUserLeave(initCtx['userId'])
      }
    }
  }

  formatError(err : GraphQLError) : GraphQLFormattedError {
    if (err.extensions && err.extensions.code === 'INTERNAL_SERVER_ERROR') {
      console.error(new Date())
      console.error(err)
      console.error(err.originalError)
    }
    return err
  }

  generateContext(ctx : any) : Context {
    const result = Object.assign({}, this.baseContext)

    if (ctx.connection && ctx.connection.context) {
      Object.assign(result, ctx.connection.context)
    }
    
    return result
  }

  listen(...opts : Array<any>) : Promise<ServerInfo> {
    return this.apolloServer.listen(...opts)
  }

}