import { CanvasMouseEvent } from "../gfx/types"
import { DUIEvent } from "./events";
import BaseGameContext from "../ctx/BaseGameContext";

export default abstract class DUIControl {

  protected ctx : BaseGameContext

  active : boolean = true

  constructor(ctx : BaseGameContext) {
    this.ctx = ctx
  }

  abstract onMouseEvent(ev : CanvasMouseEvent) : DUIEvent

  abstract draw() : void
}