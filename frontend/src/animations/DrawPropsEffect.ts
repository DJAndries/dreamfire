import Effect from "./Effect"
import { DrawProps } from "../gfx/types";

export default class DrawPropsEffect implements Effect {

  private startDrawProps : DrawProps

  private endDrawProps : DrawProps

  private currentDrawProps : DrawProps

  constructor(startDrawProps : DrawProps, endDrawProps : DrawProps) {
    this.startDrawProps = startDrawProps
    this.endDrawProps = endDrawProps
    this.currentDrawProps = Object.assign({}, startDrawProps)
  }

  getEffectData() {
    return this.currentDrawProps
  }

  update(timeElapsed: number, duration : number, interval : number) {
    const progress = Math.min(1, timeElapsed / duration)
    this.updateProp('shadowBlur', progress)
    this.updateProp('lineWidth', progress)
    this.updateProp('lineDash', progress)
  }

  private updateProp(field : string, progress : number) {
    if (!!this.startDrawProps[field]) {
      const end = this.endDrawProps[field]
      const start = this.startDrawProps[field]
      this.currentDrawProps[field] = ((end - start) * progress) + start 
    }
  }

}