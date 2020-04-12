import { Asset, AssetType } from './types'

export default class AssetManager {
  private preloadedAssets : number = 0

  private totalPreloadAssets : number = 0

  onPreload : () => void
  
  onProgress : (loaded : number, total : number) => void

  constructor(assets : object) {
    for (const value of Object.values(assets)) {
      const asset : Asset = value
      asset.noPreload = value.noPreload || false
      if (asset.noPreload) {
        this.totalPreloadAssets++
      }
      this.initData(asset)
    }
  }

  private assetPreloaded() {
    this.preloadedAssets++
    if (this.onProgress) {
      this.onProgress(this.preloadedAssets, this.totalPreloadAssets)
    }
    if (this.preloadedAssets === this.totalPreloadAssets) {
      if (this.onPreload) {
        this.onPreload()
      }
    }
  }

  private initAudio(asset: Asset) {
    const audio = new Audio(asset.url)
    if (!asset.noPreload) {
      audio.addEventListener('canplaythrough', this.assetPreloaded.bind(this))
    }
    asset.data = audio
  }

  private initImage(asset: Asset) {
    const img = new Image()
    img.onload = this.assetPreloaded.bind(this)
    img.src = asset.url
    asset.data = img
  }

  private initData(asset: Asset) {
    switch (asset.type) {
      case AssetType.Audio:
        this.initAudio(asset)
        break
      case AssetType.Image:
        this.initImage(asset)
        break
    }
  }
}