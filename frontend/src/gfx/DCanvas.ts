import { ViewportInfo, DCoords, MouseEventType, CanvasMouseEvent, DrawProps, DrawMode } from './types'

export default class DCanvas {

  canvases : HTMLCanvasElement[] = []

  ctxs : CanvasRenderingContext2D[] = []

  viewportInfo : ViewportInfo

  fixedCoordSpace : DCoords

  mouseEventCallback : (ev : CanvasMouseEvent) => void

  constructor(fixedCoordSpace : DCoords = null, mouseEventCallback : (ev : CanvasMouseEvent) => void) {
    this.fixedCoordSpace = fixedCoordSpace
    this.mouseEventCallback = mouseEventCallback
  }

  init(layers : number = 1) {
    for (let i = 0; i < layers; i++) {
      const canvas = document.createElement('canvas')
      canvas.style.width = '100%'
      canvas.style.height = '100%'
      canvas.style.position = 'fixed'
      canvas.style.top = '0'
      canvas.style.left = '0'
      canvas.style.zIndex = (layers - i - 1).toString()
      document.body.appendChild(canvas)

      this.canvases.push(canvas)
      this.ctxs.push(canvas.getContext('2d'))
      this.ctxs[i].globalCompositeOperation = 'destination-over'
    }
    window.addEventListener('click', (ev) => this.handleEvent(MouseEventType.Click, ev))
    window.addEventListener('mousemove', (ev) => this.handleEvent(MouseEventType.MouseMove, ev))
    this.updateViewportInfo()
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
    this.canvases.forEach(c => {
      c.width = window.innerWidth
      c.height = window.innerHeight
    })

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

  private getLayerCtx(index : number) {
    return this.ctxs[index || 0]
  }
  
  private setDrawProps(drawProps : DrawProps) {
    const ctx = this.getLayerCtx(drawProps.layerIndex)
    Object.assign(ctx, drawProps)
    
    ctx.shadowBlur = drawProps.shadowBlur || 0
    ctx.shadowColor = drawProps.shadowColor || null

    ctx.setLineDash([drawProps.lineDash || 0])
  }

  drawRect(drawCoords : DCoords, drawMode : DrawMode, drawProps : DrawProps = {}) {
    const ctx = this.getLayerCtx(drawProps.layerIndex)
    this.setDrawProps(drawProps)

    drawCoords = this.convertCoordsToPixels(drawCoords)
    if (drawMode == DrawMode.Stroke || drawMode == DrawMode.StrokeAndFill) {
      ctx.strokeRect(drawCoords.x, drawCoords.y, drawCoords.width, drawCoords.height)
    }
    if (drawMode == DrawMode.Fill || drawMode == DrawMode.StrokeAndFill) {
      ctx.fillRect(drawCoords.x, drawCoords.y, drawCoords.width, drawCoords.height)
    }
  }

  drawImage(drawCoords : DCoords, image : HTMLImageElement, layerIndex: number = 0) {
    const ctx = this.getLayerCtx(layerIndex)
    drawCoords = this.convertCoordsToPixels(drawCoords)
    ctx.drawImage(image, drawCoords.x, drawCoords.y, drawCoords.width, drawCoords.height)
  }

  drawRoundedRect(drawCoords : DCoords, drawMode : DrawMode, radius : number, drawProps : DrawProps = {}) {
    const ctx = this.getLayerCtx(drawProps.layerIndex)
    this.setDrawProps(drawProps)

    drawCoords = this.convertCoordsToPixels(drawCoords)
    const radiusPixels = this.viewportInfo.coordPixelScale * radius
    
    ctx.beginPath()
    ctx.moveTo(drawCoords.x + radiusPixels, drawCoords.y)
    ctx.lineTo(drawCoords.x + drawCoords.width - radiusPixels, drawCoords.y)
    ctx.quadraticCurveTo(drawCoords.x + drawCoords.width, drawCoords.y, drawCoords.x + drawCoords.width, drawCoords.y + radiusPixels)
    ctx.lineTo(drawCoords.x + drawCoords.width, drawCoords.y + drawCoords.height - radiusPixels)
    ctx.quadraticCurveTo(drawCoords.x + drawCoords.width, drawCoords.y + drawCoords.height,
      drawCoords.x + drawCoords.width - radiusPixels, drawCoords.y + drawCoords.height)
    ctx.lineTo(drawCoords.x + radiusPixels, drawCoords.y + drawCoords.height)
    ctx.quadraticCurveTo(drawCoords.x, drawCoords.y + drawCoords.height, drawCoords.x, drawCoords.y + drawCoords.height - radiusPixels)
    ctx.lineTo(drawCoords.x, drawCoords.y + radiusPixels)
    ctx.quadraticCurveTo(drawCoords.x, drawCoords.y, drawCoords.x + radiusPixels, drawCoords.y)
    ctx.closePath()

    if (drawMode == DrawMode.Fill || drawMode == DrawMode.StrokeAndFill) {
      ctx.fill()
    }

    if (drawMode == DrawMode.Stroke || drawMode == DrawMode.StrokeAndFill) {
      ctx.stroke()
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
    const ctx = this.getLayerCtx(drawProps.layerIndex)
    ctx.fillText(text, drawCoords.x, drawCoords.y)
  }

  drawCircle(drawCoords: DCoords, drawMode : DrawMode, drawProps: DrawProps = {}) {
    const ctx = this.getLayerCtx(drawProps.layerIndex)
    this.setDrawProps(drawProps)

    drawCoords = this.convertCoordsToPixels(drawCoords)
    const radius = drawCoords.width / 2

    ctx.beginPath()
    ctx.moveTo(drawCoords.x + drawCoords.width, drawCoords.y + radius)
    ctx.arc(drawCoords.x + radius, drawCoords.y + radius,
      drawCoords.width / 2, 0, 2 * Math.PI)
    ctx.closePath()

    if (drawMode == DrawMode.Fill || drawMode == DrawMode.StrokeAndFill) {
      ctx.fill()
    }
    if (drawMode == DrawMode.Stroke || drawMode == DrawMode.StrokeAndFill) {
      ctx.stroke()
    }
    
  }

  drawPath(path : Path2D, drawCoords : DCoords, drawProps : DrawProps = {}, drawMode : DrawMode = DrawMode.Stroke) {
    const ctx = this.getLayerCtx(drawProps.layerIndex)
    this.setDrawProps(drawProps)

    drawCoords = this.convertCoordsToPixels(drawCoords)

    ctx.translate(drawCoords.x, drawCoords.y)
    if (drawMode === DrawMode.StrokeAndFill || drawMode === DrawMode.Stroke) {
      ctx.stroke(path)
    }
    if (drawMode === DrawMode.StrokeAndFill || drawMode == DrawMode.Fill) {
      ctx.fill(path)
    }
    ctx.translate(-drawCoords.x, -drawCoords.y)
  }

  clear(layerIndex : number = null) {
    if (layerIndex !== null) {
      this.getLayerCtx(layerIndex).clearRect(0, 0, window.innerWidth, window.innerHeight)
    } else {
      this.ctxs.forEach(v => v.clearRect(0, 0, window.innerWidth, window.innerHeight))
    }
  }

  clearRect(drawCoords : DCoords, layerIndex : number) {
    drawCoords = this.convertCoordsToPixels(drawCoords)
    this.getLayerCtx(layerIndex).clearRect(drawCoords.x, drawCoords.y, drawCoords.width, drawCoords.height)
  }
}