import CollisionQuadTree from "./CollisionQuadTree"
import Coords from '../models/Coords'
import CollisionObject from "./CollisionObject"

export default class CollisionDetector {
  quadTree: CollisionQuadTree

  constructor(boundary: Coords, quadTreeBucketSize : number = 6) {
    this.quadTree = new CollisionQuadTree(boundary, quadTreeBucketSize)
  }

  clear() {
    this.quadTree.clear()
  }

  prepare(objs : CollisionObject[]) {
    for (const obj of objs) {
      if (!this.quadTree.insert(obj)) {
        throw new Error('Failed to insert element in quadtree')
      }
    }
  }

  query(obj : CollisionObject) : CollisionObject[] {
    const candidates = this.quadTree.query(obj)

    const sourceRect = obj.rect
    return candidates.filter((v) => {
      const targetRect = v.rect
      return (sourceRect.x < targetRect.x + targetRect.width &&
        sourceRect.x + sourceRect.width > targetRect.x &&
        sourceRect.y < targetRect.y + targetRect.height &&
        sourceRect.y + sourceRect.height > targetRect.y)
    })
  }
}