import AudioPlayHack from 'dreamfire-frontend/assets/AudioPlayHack'
import MainStage from './stages/MainStage'
import DreamfireGame from 'dreamfire-frontend/DreamfireGame'
import GameContext from './ctx/GameContext'
import GameAssets from './assets/GameAssets'
import GameStore from './state/GameStore'
import { joinGameOp, playersChangedSubOp } from './comm/game_ops'
import PlayerDef from 'models/PlayerDef'

const API_HOST = process.env.NODE_ENV === 'production' ? 'api.funnyfarm.andries.ca' : 'localhost:4001'

class Game extends DreamfireGame {

  ctx : GameContext

  constructor() {
    super()
  }
  
  async init() {
    await super.init()

    this.ctx = new GameContext()

    this.setBaseCtx(this.ctx)

    this.ctx.assets = new GameAssets()
    this.ctx.store = new GameStore()

    this.initCanvas({ width: 20, height: 10 })
    this.initAssets(this.ctx.assets)
    await this.initCommClient(API_HOST, process.env.NODE_ENV === 'production')

    await this.joinGame()

    this.initUpdateInterval()

    new AudioPlayHack(this.ctx.assets.blank.data)

    this.changeStage(new MainStage(this.ctx))
  }

  async joinGame() {
    const urlParams = new URLSearchParams(window.location.search)
    const playerName = urlParams.get('u')
    const gameName = urlParams.get('g')

    if (!playerName || !gameName) {
      throw new Error('No player or game name')
    }

    const store = this.ctx.store

    store.gameDef = await joinGameOp(this.ctx, gameName, playerName)
    store.me = store.gameDef.players.find((v : PlayerDef) => v.id === this.ctx.commClient.userId)

    this.setupSubs()
  }

  private setupSubs() {
    const store = this.ctx.store
    store.playersChangedSub = playersChangedSubOp(this.ctx)
    store.playersChangedSub.subscribe((v) => {
      Object.assign(store.gameDef, v)
    })
  }
}

const main = async () => {
  const game = new Game()
  await game.init()
}

main().catch((err) => {
  console.error(err)
})