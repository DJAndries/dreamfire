import BaseGameContext from "./ctx/BaseGameContext"
import AssetManager from "./assets/AssetManager"
import CommClient from "./comm/CommClient"
import { CanvasMouseEvent, DCoords } from "./gfx/types"
import DCanvas from "./gfx/DCanvas"
import Stage from "./stages/Stage"

export default class DreamfireGame {

  private baseCtx : BaseGameContext

  async init() {
    this.initAuxEvents()
  }

  resizeHandler() {
    this.baseCtx.dCanvas.updateViewportInfo()
    this.baseCtx.currentStage.draw()
  }

  protected initAssets(assets : object, onPreload : () => void = null, onProgress : (loaded : number, total : number) => void = null) {
    this.baseCtx.assetManager = new AssetManager(assets, onPreload, onProgress)
  }

  private initAuxEvents() {
    window.addEventListener('resize', this.resizeHandler.bind(this))
    window.addEventListener('keyup', (ev) => this.keyboardHandler(ev, false))
    window.addEventListener('keydown', (ev) => this.keyboardHandler(ev, true))
  }

  protected async initCommClient(hostAndPort : string = null, secure : boolean = false) {
    if (hostAndPort !== null) {
      this.baseCtx.commClient = new CommClient(hostAndPort, secure)
    } else {
      this.baseCtx.commClient = new CommClient()
    }
    await this.baseCtx.commClient.init()
  }

  protected initCanvas(fixedCoordSpace : DCoords = null, layerCount : number = 1) {
    this.baseCtx.dCanvas = new DCanvas(fixedCoordSpace, this.mouseHandler.bind(this))
    this.baseCtx.dCanvas.init(layerCount)
  }

  protected initUpdateInterval(interval : number = 20) {
    setInterval(() => this.update(interval), interval)
  }

  protected setBaseCtx(ctx : BaseGameContext) {
    this.baseCtx = ctx
  }

  mouseHandler(ev : CanvasMouseEvent) {
    this.baseCtx.currentStage.onMouseEvent(ev)
  }

  keyboardHandler(ev : KeyboardEvent, isDown : boolean) {
    if (ev.repeat) {
      return
    }
    this.baseCtx.currentStage.onKeyboardEvent(ev, isDown)
  }

  changeStage(stage : Stage) {
    this.baseCtx.currentStage = stage
    this.baseCtx.currentStage.init()
    this.baseCtx.currentStage.draw()
  }

  update(interval : number) {
    this.baseCtx.currentStage.update(interval)
  }
}