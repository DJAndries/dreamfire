import Game from './Game'
import { UserInputError } from 'dreamfire-backend/errors'

export default class GameManager {

  connectionGameMap : Map<string, Game> = new Map<string, Game>()

  gameMap : Map<string, Game> = new Map<string, Game>()

  joinGame(gameName : string, playerName : string, userId : string) : Game {
    if (this.connectionGameMap.get(userId)) {
      throw new UserInputError('ALREADY_IN_GAME')
    }

    if (!this.gameMap.get(gameName)) {
      this.gameMap.set(gameName, new Game(gameName))
    }

    this.gameMap.get(gameName).joinGame(userId, playerName)
    this.connectionGameMap.set(userId, this.gameMap.get(gameName))
    return this.gameMap.get(gameName)
  }

  leaveGame(userId : string, noErr : boolean = false) : Game { 
    const game = this.connectionGameMap.get(userId)
    if (!game) {
      if (noErr) return null
      throw new UserInputError('NOT_IN_GAME')
    }

    if (game.leaveGame(userId)) {
      this.gameMap.delete(game.gameName)
    }

    this.connectionGameMap.delete(userId)
    return game
  }

  getGame(userId : string) {
    return this.connectionGameMap.get(userId)
  }
}