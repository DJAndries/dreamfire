import Animation from "./Animation"

export default class AnimationSequence {
  animationList : Array<Animation> = new Array<Animation>()

  currentAnimation : Animation = null

  add(animation : Animation) {
    this.animationList.push(animation)
  }

  update(interval : number) : boolean {
    if (this.animationList.length < 1) {
      return false
    }
    this.currentAnimation = this.animationList[0] || null
    if (!this.currentAnimation.update(interval)) {
      this.animationList.splice(0, 1)
    }
    return true
  }
}