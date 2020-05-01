import DUIControl from "./DUIControl"
import { CanvasMouseEvent } from "../gfx/types"
import { DUIEvent } from "./events"

export default class DUIOverlay {
  
  controls : Map<string, DUIControl> = new Map<string, DUIControl>()

  onMouseClick(ev : CanvasMouseEvent) : DUIEvent {
    for (const control of this.controls.entries()) {
      let result = control[1].onMouseEvent(ev)
      if (result) {
        result.controlId = control[0]
        return result
      }
    }
    return null
  }

  draw() {
    for (const control of this.controls.values()) {
      control.draw()
    }
  }
}