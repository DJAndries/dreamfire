import BaseGameContext from 'dreamfire-frontend/ctx/BaseGameContext'
import GameAssets from 'assets/GameAssets'
import GameStore from 'state/GameStore'

export default class GameContext extends BaseGameContext {

  assets : GameAssets

  store : GameStore

}