import Effect from './Effect'

export default class KeyframeEffect implements Effect {

  keyframes : any[]

  keyframeIndex : number

  constructor(keyframes : any[]) {
    this.keyframes = keyframes
    this.keyframeIndex = 0
  }

  getEffectData() {
    return this.keyframes[this.keyframeIndex]
  }

  update(timeElapsed: number, duration: number, interval: number) {
    this.keyframeIndex = Math.min(this.keyframes.length - 1, Math.floor((timeElapsed / duration) * this.keyframes.length))
  }
  
}