import DCanvas from "../gfx/DCanvas"
import { DCoords } from "../gfx/types"

export default class Tileset {

  constructor(
    public image : HTMLImageElement,
    public tileWidth : number,
    public tileHeight : number,
    public tileSetWidth : number) {}

  draw(dCanvas : DCanvas, drawCoords : DCoords, tileIndex : number, layerIndex : number = 0) {
    const tileY = Math.floor(tileIndex / this.tileSetWidth)
    const tileX = Math.floor(tileIndex % this.tileSetWidth)
    const localCoords = {
      x: tileX * this.tileWidth,
      y: tileY * this.tileHeight,
      width: this.tileWidth,
      height: this.tileHeight
    }
    dCanvas.drawImage(drawCoords, this.image, layerIndex, localCoords)
  }
}