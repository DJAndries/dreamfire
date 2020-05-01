import Animation from "./Animation"

export default class AnimationGroup {
  groupSet : Set<Animation> = new Set<Animation>()

  add(animation : Animation) {
    this.groupSet.add(animation)
  }

  update(interval : number) : boolean {
    let needsRender = this.groupSet.size > 0
    this.groupSet.forEach((v) => {
      if (!v.update(interval)) {
        this.groupSet.delete(v)
      }
    })
    return needsRender
  }
}