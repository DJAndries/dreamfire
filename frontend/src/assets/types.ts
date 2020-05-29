export enum AssetType {
  Image,
  Audio,
  Text
}

export interface Asset {
  type: AssetType
  url: string
  data?: any
  noPreload?: boolean
}