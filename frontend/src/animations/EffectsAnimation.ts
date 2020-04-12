import Animation from "./Animation"
import { DrawProps } from "../gfx/types"
import Effect from "./Effect"

export default class EffectsAnimation implements Animation {

  effects : Effect[]

  private duration : number

  private timeElapsed : number = 0

  additionalInfo: any

  constructor(duration: number, additionalInfo : any, effects : Effect[]) {
    this.duration = duration
    this.additionalInfo = additionalInfo
    this.effects = effects
  }

  update(interval: number): boolean {
    if (this.timeElapsed >= this.duration) {
      return false
    }
    this.timeElapsed += interval
    for (const effect of this.effects) {
      effect.update(this.timeElapsed, this.duration, interval)
    }
    return true
  }
}