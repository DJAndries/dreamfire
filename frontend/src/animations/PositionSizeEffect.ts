import { DCoords } from "../gfx/types"

export default class PositionSizeEffect {
  private startCoords : DCoords

  private endCoords : DCoords

  private currentCoords : DCoords

  constructor(startCoords : DCoords, endCoords : DCoords) {
    this.startCoords = startCoords
    this.endCoords = endCoords
    this.currentCoords = Object.assign({}, startCoords)
  }

  getEffectData() {
    return this.currentCoords
  }

  update(timeElapsed: number, duration : number, interval : number) {
    const progress = Math.min(1, timeElapsed / duration)
    this.updateProp('x', progress)
    this.updateProp('y', progress)
    if (!!this.startCoords.width && !!this.startCoords.height) {
      this.updateProp('width', progress)
      this.updateProp('height', progress)
    }
  }

  private updateProp(field : string, progress : number) {
    const end = this.endCoords[field]
    const start = this.startCoords[field]
    this.currentCoords[field] = ((end - start) * progress) + start 
  }
}