import { createToken } from './util/auth'

const resolvers = {
  Mutation: {
    createToken: (parent, args) => {
      return createToken()
    }
  },
  Query: {
    hello: () => 'hello!'
  }
}

export default resolvers