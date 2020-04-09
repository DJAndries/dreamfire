import { DCoords, CanvasMouseEvent, DrawProps, MouseEventType, DrawMode } from "../gfx/types"
import DUIControl from "./DUIControl"
import { DUIEvent, DUIEventType } from "./events"
import BaseGameContext from "../ctx/BaseGameContext"

const DEFAULT_BUTTON_COLOR = '#1976d2'

export default class DUIButton extends DUIControl {

  protected coords : DCoords

  protected drawProps : DrawProps

  protected buttonText : string

  protected customRadius : number

  constructor(ctx : BaseGameContext, coords : DCoords, buttonText : string, customRadius : number = null, drawProps : DrawProps = null) {
    super(ctx)
    this.coords = coords
    this.drawProps = drawProps
    this.buttonText = buttonText
    this.customRadius = customRadius
  }

  onMouseEvent(ev: CanvasMouseEvent) : DUIEvent {
    if (!this.active || ev.type !== MouseEventType.Click) {
      return null
    }
    if (ev.coords.x >= this.coords.x && ev.coords.y >= this.coords.y &&
      ev.coords.x <= (this.coords.x + this.coords.width) && ev.coords.y <= (this.coords.y + this.coords.height)) {
      return {
        type: DUIEventType.Click,
        controlId: null,
        data: null
      }
    }
    return null
  }

  draw(): void {
    if (!this.active) {
      return
    }
    const fontSize = this.coords.height / 2
    const drawProps : DrawProps = {
      fillStyle: DEFAULT_BUTTON_COLOR,
      strokeStyle: DEFAULT_BUTTON_COLOR,
      lineWidth: 1,
      textAlign: 'center',
      font: fontSize + 'u "Roboto", "Helvetica", "Arial", sans-serif'
    }
    Object.assign(drawProps, this.drawProps)

    const radius = this.customRadius || this.coords.height / 6
    this.ctx.dCanvas.drawRoundedRect(this.coords, DrawMode.Stroke, radius, drawProps)

    const textCoords : DCoords = Object.assign({}, this.coords)
    textCoords.x += textCoords.width / 2
    textCoords.y += textCoords.height / 2 + (fontSize / 3)

    this.ctx.dCanvas.drawText(textCoords, drawProps, this.buttonText)
  }
}