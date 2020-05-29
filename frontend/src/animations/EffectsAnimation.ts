import Animation from "./Animation"
import { DrawProps } from "../gfx/types"
import Effect from "./Effect"

export default class EffectsAnimation implements Animation {

  effects : Effect[]

  private duration : number

  private timeElapsed : number = 0

  additionalInfo: any

  repeating : boolean

  constructor(duration: number, additionalInfo : any, effects : Effect[], repeating : boolean = false) {
    this.duration = duration
    this.additionalInfo = additionalInfo
    this.effects = effects
    this.repeating = repeating
  }

  update(interval: number): boolean {
    if (this.timeElapsed >= this.duration) {
      if (!this.repeating) {
        return false
      }
      this.timeElapsed = 0
    }
    for (const effect of this.effects) {
      effect.update(this.timeElapsed, this.duration, interval)
    }
    this.timeElapsed += interval
    return true
  }
}