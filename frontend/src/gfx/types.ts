
export interface DrawProps {
  shadowColor? : string,
  shadowBlur? : number,
  lineJoin? : string,
  lineWidth? : number,
  strokeStyle? : string,
  fillStyle? : string,
  lineDash? : number,
  font? : string,
  textAlign? : string,
  [key: string]: any
}

export interface ViewportInfo {
  coordPixelScale : number,
  coordWidth : number,
  coordHeight : number
}

export interface DCoords {
  x? : number,
  y? : number,
  width? : number,
  height? : number
}

export enum DrawMode {
  Stroke,
  Fill,
  StrokeAndFill
}

export enum MouseEventType {
  Click,
  MouseMove
}

export interface CanvasMouseEvent {
  origEvent : MouseEvent,
  coords : DCoords,
  type : MouseEventType
}