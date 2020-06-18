import { gql } from 'apollo-server'

const typeDefs = gql`
  type UserToken {
    token: String
    id: String
  }

  type Mutation {
    createToken: UserToken
  }

  type Query {
    hello: String
  }
`

export default typeDefs