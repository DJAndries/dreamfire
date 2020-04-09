import { ViewportInfo, DCoords, MouseEventType, CanvasMouseEvent, DrawProps, DrawMode } from './types'

export default class DCanvas {

  canvas : HTMLCanvasElement

  ctx : CanvasRenderingContext2D

  viewportInfo : ViewportInfo

  fixedCoordSpace : DCoords

  mouseEventCallback : (ev : CanvasMouseEvent) => void

  constructor(fixedCoordSpace : DCoords = null, mouseEventCallback : (ev : CanvasMouseEvent) => void) {
    this.fixedCoordSpace = fixedCoordSpace
    this.mouseEventCallback = mouseEventCallback
  }

  init() {
    this.canvas = document.createElement('canvas')
    this.canvas.style.width = '100%'
    this.canvas.style.height = '100%'
    this.canvas.style.position = 'absolute'
    this.canvas.style.top = '0'
    this.canvas.style.left = '0'
    document.body.appendChild(this.canvas)

    this.ctx = this.canvas.getContext('2d')
    this.ctx.globalCompositeOperation = 'destination-over'
    this.updateViewportInfo()
    
    this.canvas.addEventListener('click', (ev) => this.handleEvent(MouseEventType.Click, ev))
    this.canvas.addEventListener('mousemove', (ev) => this.handleEvent(MouseEventType.MouseMove, ev))
  }

  private handleEvent(eventType : MouseEventType, ev : MouseEvent) {
    const result : CanvasMouseEvent = {
      origEvent: ev,
      coords: { x: ev.offsetX, y: ev.offsetY },
      type: eventType
    }
    this.convertPixelsToCoords(result.coords)
    this.mouseEventCallback(result)
  }

  updateViewportInfo() {
    let coordWidth : number
    let coordHeight : number
    let coordPixelScale : number

    if (this.fixedCoordSpace == null) {
      if (window.innerWidth > window.innerHeight) {
        coordWidth = window.innerWidth / window.innerHeight * 2.0
        coordHeight = 2.0
      } else {
        coordWidth = 2.0
        coordHeight = window.innerHeight / window.innerWidth * 2.0
      }
    } else {
      coordWidth = this.fixedCoordSpace.width
      coordHeight = this.fixedCoordSpace.height
    }

    coordPixelScale = (coordWidth / coordHeight) < (window.innerWidth / window.innerHeight) ? (window.innerHeight / coordHeight) : (window.innerWidth / coordWidth)

    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight

    this.viewportInfo = {
      coordHeight,
      coordWidth,
      coordPixelScale
    }
  }

  private convertCoordsToPixels(drawCoords : DCoords) : DCoords {
    return {
      x: (window.innerWidth / 2.0) + (drawCoords.x * this.viewportInfo.coordPixelScale),
      y: (window.innerHeight / 2.0) + (drawCoords.y * this.viewportInfo.coordPixelScale),
      width: drawCoords.width * this.viewportInfo.coordPixelScale,
      height: drawCoords.height * this.viewportInfo.coordPixelScale
    }
  }

  private convertPixelsToCoords(pixels : DCoords) {
    pixels.x = (pixels.x - (window.innerWidth / 2.0)) / this.viewportInfo.coordPixelScale
    pixels.y = (pixels.y - (window.innerHeight / 2.0)) / this.viewportInfo.coordPixelScale
    pixels.width = pixels.width / this.viewportInfo.coordPixelScale
    pixels.height = pixels.height / this.viewportInfo.coordPixelScale
  }
  
  private setDrawProps(drawProps : DrawProps) {
    Object.assign(this.ctx, drawProps)
    
    this.ctx.shadowBlur = drawProps.shadowBlur || 0
    this.ctx.shadowColor = drawProps.shadowColor || null
  }

  drawRect(drawCoords : DCoords, drawMode : DrawMode, drawProps : DrawProps = {}) {
    this.setDrawProps(drawProps)

    this.ctx.setLineDash([drawProps.lineDash || 0])

    drawCoords = this.convertCoordsToPixels(drawCoords)
    if (drawMode == DrawMode.Fill || drawMode == DrawMode.StrokeAndFill) {
      this.ctx.fillRect(drawCoords.x, drawCoords.y, drawCoords.width, drawCoords.height)
    }
    if (drawMode == DrawMode.Stroke || drawMode == DrawMode.StrokeAndFill) {
      this.ctx.strokeRect(drawCoords.x, drawCoords.y, drawCoords.width, drawCoords.height)
    }
  }

  drawRoundedRect(drawCoords : DCoords, drawMode : DrawMode, radius : number, drawProps : DrawProps = {}) {
    this.setDrawProps(drawProps)

    this.ctx.setLineDash([drawProps.lineDash || 0])

    drawCoords = this.convertCoordsToPixels(drawCoords)
    const radiusPixels = this.viewportInfo.coordPixelScale * radius
    
    this.ctx.beginPath()
    this.ctx.moveTo(drawCoords.x + radiusPixels, drawCoords.y)
    this.ctx.lineTo(drawCoords.x + drawCoords.width - radiusPixels, drawCoords.y)
    this.ctx.quadraticCurveTo(drawCoords.x + drawCoords.width, drawCoords.y, drawCoords.x + drawCoords.width, drawCoords.y + radiusPixels)
    this.ctx.lineTo(drawCoords.x + drawCoords.width, drawCoords.y + drawCoords.height - radiusPixels)
    this.ctx.quadraticCurveTo(drawCoords.x + drawCoords.width, drawCoords.y + drawCoords.height,
      drawCoords.x + drawCoords.width - radiusPixels, drawCoords.y + drawCoords.height)
    this.ctx.lineTo(drawCoords.x + radiusPixels, drawCoords.y + drawCoords.height)
    this.ctx.quadraticCurveTo(drawCoords.x, drawCoords.y + drawCoords.height, drawCoords.x, drawCoords.y + drawCoords.height - radiusPixels)
    this.ctx.lineTo(drawCoords.x, drawCoords.y + radiusPixels)
    this.ctx.quadraticCurveTo(drawCoords.x, drawCoords.y, drawCoords.x + radiusPixels, drawCoords.y)
    this.ctx.closePath()

    if (drawMode == DrawMode.Fill || drawMode == DrawMode.StrokeAndFill) {
      this.ctx.fill()
    }
    if (drawMode == DrawMode.Stroke || drawMode == DrawMode.StrokeAndFill) {
      this.ctx.stroke()
    }
  }

  drawText(drawCoords: DCoords, drawProps : DrawProps = {}, text : string) {
    if (drawProps.font) {
      drawProps.font = drawProps.font.split(' ').map((v, i) => {
        if (i === 0 && v.endsWith('u')) {
          return (parseFloat(v.split('u')[0]) * this.viewportInfo.coordPixelScale) + 'px'
        }
        return v
      }).join(' ')
    }
    drawCoords = this.convertCoordsToPixels(drawCoords)

    this.setDrawProps(drawProps)
    
    this.ctx.fillText(text, drawCoords.x, drawCoords.y)
  }

  clear() {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
  }

  clearRect(drawCoords : DCoords) {
    drawCoords = this.convertCoordsToPixels(drawCoords)
    this.ctx.clearRect(drawCoords.x, drawCoords.y, drawCoords.width, drawCoords.height)
  }
}