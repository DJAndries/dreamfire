
export default interface Effect {

  getEffectData() : any

  update(timeElapsed : number, duration : number, interval : number)
}