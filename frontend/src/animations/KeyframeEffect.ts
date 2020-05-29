import Effect from './Effect'

export default class KeyframeEffect implements Effect {

  keyframes : any[]

  keyframeIndex : number

  constructor(keyframes : any[], keyframeCount : number = null) {
    this.keyframes = keyframes
    if (keyframeCount !== null) {
      this.keyframes = Array.from(new Array(keyframeCount).keys())
    }
    this.keyframeIndex = 0
  }

  getEffectData() {
    return this.keyframes[this.keyframeIndex]
  }

  update(timeElapsed: number, duration: number, interval: number) {
    this.keyframeIndex = Math.min(this.keyframes.length - 1, Math.floor((timeElapsed / duration) * this.keyframes.length))
  }
  
}