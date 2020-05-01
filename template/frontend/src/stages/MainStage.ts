import Stage from 'dreamfire-frontend/stages/Stage'
import BlokusGameDef from 'models/GameDef'
import GameContext from 'ctx/GameContext'
import { CanvasMouseEvent, MouseEventType, DrawProps } from 'dreamfire-frontend/gfx/types'
import eventHandleChain from 'dreamfire-frontend/util/eventHandleChain'

export default class MainStage implements Stage {

  ctx : GameContext

  constructor(ctx : GameContext) {
    this.ctx = ctx
    
    ctx.store.playersChangedSub.subscribe(this.handlePlayersChanged.bind(this))
  }

  init(): void {

  }
  
  update(interval : number): void {
  }

  handlePlayersChanged(game : BlokusGameDef) {
    this.draw()
  }

  onMouseEvent(ev : CanvasMouseEvent) {
    switch (ev.type) {
      case MouseEventType.MouseMove:
        break
      case MouseEventType.Click:
        break
    }
  }

  onKeyboardEvent(ev : KeyboardEvent) {
  }

  private displayPlayers() {
    const drawProps : DrawProps = {
      textAlign: 'center'
    }
    this.ctx.dCanvas.drawText(
      { x: 0, y: 0 },
      drawProps,
      `Players: ${this.ctx.store.gameDef.players.map((v) => v.name).join(', ')}`
    )
  }

  draw(): void {
    this.ctx.dCanvas.clear()
    this.displayPlayers()
  }

}