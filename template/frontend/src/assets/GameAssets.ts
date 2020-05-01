import { Asset, AssetType } from 'dreamfire-frontend/assets/types'

export default class GameAssets {
  blank : Asset = {
    type: AssetType.Audio,
    url: require('./blank.mp3').default
  }
}