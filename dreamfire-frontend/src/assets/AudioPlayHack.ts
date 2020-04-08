import { Asset } from "./types"

export default class AudioPlayHack {

  constructor(blankSound : HTMLAudioElement) {
    setInterval(() => {
      blankSound.play().catch((e) => {})
    }, 750)
  }

}