import Effect from "./Effect"

export default class DimensionEffect implements Effect {
  private start : number

  private end : number

  private current : number

  constructor(start : number, end : number) {
    this.current = this.start = start
    this.end = end
  }

  getEffectData() {
    return this.current
  }

  update(timeElapsed: number, duration : number, interval : number) {
    const progress = Math.min(1, timeElapsed / duration)
    this.current = ((this.end - this.start) * progress) + this.start 
  }
}