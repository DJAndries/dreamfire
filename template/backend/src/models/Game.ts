import Player from "./Player"
import { UserInputError } from "dreamfire-backend/errors"

export default class Game {

  playerMap : Map<number, Player> = new Map<number, Player>()

  gameName : string

  constructor(gameName : string) {
    this.gameName = gameName
  }

  joinGame(userId : string, playerName : string) {
    let availIndex = null
    // Find available player index
    for (let i = 1; i <= 4; i++) {
      const player = this.playerMap.get(i)
      if (!player && !availIndex) {
        availIndex = i
      } else if (player && player.id == userId) {
        throw new UserInputError('ALREADY_IN_GAME')
      }
    }

    // If index available, insert player with that index
    if (availIndex) {
      this.playerMap.set(availIndex, {
        id: userId,
        index: availIndex,
        name: playerName
      })
      return
    }
    throw new UserInputError('GAME_FULL')
  }

  leaveGame(userId : string) : boolean {
    for (let i = 1; i <= 4; i++) {
      const player = this.playerMap.get(i)
      if (player && player.id === userId) {
        this.playerMap.delete(i)
        break
      }
    }
    return this.playerMap.size === 0
  }
}