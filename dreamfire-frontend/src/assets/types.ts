export enum AssetType {
  Image,
  Audio
}

export interface Asset {
  type: AssetType
  url: string
  data?: any
  noPreload?: boolean
}