import { gql, Observable } from 'dreamfire-frontend/util'
import GameContext from 'ctx/GameContext'
import BlokusGameDef from 'models/GameDef'

export const joinGameOp = (ctx : GameContext, gameName : string, playerName : string) : Promise<BlokusGameDef> => {
  return ctx.commClient.client.mutate({
    mutation: gql`mutation joinGame($gameName : String, $playerName : String) {
      gameJoinGame(gameName: $gameName, playerName: $playerName) {
        gameName
        players {
          id
          name
          index
        }
      }
    }`,
    variables: {
      gameName,
      playerName
    }
  }).then((result) => {
    return result.data.gameJoinGame
  })
}

export const playersChangedSubOp = (ctx : GameContext) : Observable<any> => {
  return new Observable<any>((observer) => {
    ctx.commClient.client.subscribe({
      query: gql`subscription {
        gamePlayersChanged {
          players {
            id
            name
            index
          }
        }
      }`
    }).subscribe((v) => {
      observer.next(v.data.gamePlayersChanged)
    })
  })
}


