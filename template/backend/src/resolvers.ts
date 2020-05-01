import Game from "./models/Game"
import { checkUser } from 'dreamfire-backend/util/auth'
import { subscribe, publish } from 'dreamfire-backend/pubsub'
import { PLAYERS_CHANGED, gameSubFilter } from './events'

export const gameReducer = (game : Game) => {
  if (!game) {
    return null
  }
  return {
    gameName: game.gameName,
    players: Array.from(game.playerMap.values())
  }
}

export const playerLeave = (gameManager, userId) => {
  const game = gameManager.leaveGame(userId)
  if (game) {
    publish(PLAYERS_CHANGED, gameReducer(game))
  }
}

const resolvers = {
  Subscription: {
    [PLAYERS_CHANGED]: {
      subscribe: subscribe(PLAYERS_CHANGED, gameSubFilter(PLAYERS_CHANGED))
    }
  },
  Query: {
    game: (parent, args, { gameManager, userId }) => {
      checkUser(userId)
      return gameReducer(gameManager.getGame(userId))
    }
  },
  Mutation: {
    joinGame: (parent, { gameName, playerName }, { gameManager, userId }) => {
      checkUser(userId)
      const game = gameReducer(gameManager.joinGame(gameName, playerName, userId))
      publish(PLAYERS_CHANGED, game)
      return game
    },
    leaveGame: (parent, args, { gameManager, userId }) => {
      checkUser(userId)
      playerLeave(gameManager, userId)
      return true
    }
  }
}

export default resolvers