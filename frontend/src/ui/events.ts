

export enum DUIEventType {
  Click
}

export interface DUIEvent {
  type : DUIEventType

  controlId : string

  data : any
}