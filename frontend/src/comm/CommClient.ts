import ApolloClient from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { ApolloLink } from 'apollo-link'
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory'
import gql from 'graphql-tag'

export default class CommClient {

  wsUri : string
  httpUri : string
  client : ApolloClient<NormalizedCacheObject>

  authToken : string
  userId : string

  constructor(hostAndPort : string = '127.0.0.1:4001', secure : boolean = false) {
    this.wsUri = `${secure ? 'wss' : 'ws'}://${hostAndPort}/graphql`
    this.httpUri = `${secure ? 'https' : 'http'}://${hostAndPort}/graphql`
  }

  private createClient(isHttp : boolean = false) : ApolloClient<NormalizedCacheObject> {
    let link : ApolloLink
    if (isHttp) {
      link = createHttpLink({ uri: this.httpUri })
    } else {
      link = new WebSocketLink({
        uri: this.wsUri,
        options: {
          connectionParams: () => ({ authToken: this.authToken })
        }
      })
    }
    return new ApolloClient<NormalizedCacheObject>({
      link,
      cache: new InMemoryCache()
    })
  }

  async init() {
    const authClient = this.createClient(true)
    const authResult = await authClient.mutate({
      mutation: gql`mutation {
        createToken {
          id
          token
        }
      }`
    })
    if (!authResult.data || !authResult.data.createToken) {
      throw new Error('Failed to create auth token')
    }
    this.authToken = authResult.data.createToken.token
    this.userId = authResult.data.createToken.id
    this.client = this.createClient()
  }
}