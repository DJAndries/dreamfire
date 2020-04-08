import Animation from "./Animation"
import { DrawProps } from "../gfx/types"

export default class DrawPropsAnimation implements Animation {

  private startDrawProps : DrawProps

  private endDrawProps : DrawProps

  private currentDrawProps : DrawProps

  private duration : number

  private timeElapsed : number = 0

  additionalInfo: any

  constructor(startDrawProps : DrawProps, endDrawProps : DrawProps, duration: number, additionalInfo : any) {
    this.startDrawProps = startDrawProps
    this.endDrawProps = endDrawProps
    this.currentDrawProps = Object.assign({}, startDrawProps)
    this.duration = duration
    this.additionalInfo = additionalInfo
  }

  update(interval: number): boolean {
    this.timeElapsed += interval
    const progress = Math.min(1, this.timeElapsed / this.duration)
    this.updateProp('shadowBlur', progress)
    this.updateProp('lineWidth', progress)
    this.updateProp('lineDash', progress)
    return this.timeElapsed < this.duration
  }

  private updateProp(field : string, progress : number) {
    if (!!this.startDrawProps[field]) {
      const end = this.endDrawProps[field]
      const start = this.startDrawProps[field]
      this.currentDrawProps[field] = ((end - start) * progress) + start 
    }
  }

  getAnimationData() {
    return this.currentDrawProps
  }
}