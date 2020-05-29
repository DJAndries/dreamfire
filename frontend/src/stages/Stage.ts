import { CanvasMouseEvent } from "../gfx/types";

export default interface Stage {
  init() : void

  update(interval : number) : void

  draw() : void

  onMouseEvent(ev : CanvasMouseEvent) : void

  onKeyboardEvent(ev : KeyboardEvent, isDown : boolean) : void
}