import { gql } from 'dreamfire-backend/util'

const typeDefs = gql`
  type Subscription {
    gamePlayersChanged: Game
  }

  type Player {
    id: ID
    index: Int
    name: String
  }

  type Game {
    gameName: String
    players: [Player]
  }

  type Query {
    game: Game
  }

  type Mutation {
    joinGame(gameName: String, playerName: String): Game
    leaveGame: Boolean
  }
`

export default typeDefs