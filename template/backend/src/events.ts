import { FilterFn } from 'dreamfire-backend/pubsub'

export const PLAYERS_CHANGED = 'gamePlayersChanged'

export const gameSubFilter = (eventName : string) : FilterFn => (payload, args, context) => {
  if (!context.userId) {
    return false
  }
  const game = context.gameManager.getGame(context.userId)
  if (!game) {
    return false
  }
  return game.gameName === payload[eventName].gameName
}
