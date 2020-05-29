import Coords from "../models/Coords"
import CollisionObject from "./CollisionObject"

export default class CollisionQuadTree {

  nodes: CollisionQuadTree[] = null

  boundary: Coords

  objects: CollisionObject[] = []

  maxObjs : number

  constructor(boundary: Coords, maxObjs : number = 6) {
    this.boundary = boundary
    this.maxObjs = maxObjs
  }

  private inBounds(rect: Coords) : boolean {
    return rect.x >= this.boundary.x && rect.y >= this.boundary.y &&
      (rect.x + rect.width!) <= (this.boundary.x + this.boundary.width!) &&
      (rect.y + rect.height!) <= (this.boundary.y + this.boundary.height!)
  }

  private subdivide() {
    const halfWidth = this.boundary.width! / 2
    const halfHeight = this.boundary.height! / 2
    const xMiddle = this.boundary.x + halfWidth
    const yMiddle = this.boundary.y + halfHeight
    const baseCoords : Coords = { x: this.boundary.x, y: this.boundary.y, width: halfWidth, height: halfHeight }
    this.nodes = [
      new CollisionQuadTree(Object.assign({}, baseCoords), this.maxObjs),
      new CollisionQuadTree(Object.assign({}, baseCoords, { x: xMiddle }), this.maxObjs),
      new CollisionQuadTree(Object.assign({}, baseCoords, { y: yMiddle }), this.maxObjs),
      new CollisionQuadTree(Object.assign({}, baseCoords, { x: xMiddle, y: yMiddle }), this.maxObjs),
    ]

    let i = this.objects.length
    while (i--) {
      for (const node of this.nodes) {
        if (node.insert(this.objects[i])) {
          this.objects.splice(i, 1)
          break
        }
      }
    }
  }
  
  clear() {
    this.objects = []
    this.nodes = null
  }

  insert(obj: CollisionObject) : boolean {
    if (!this.inBounds(obj.rect)) {
      return false
    }

    if (this.objects.length < this.maxObjs && !this.nodes) {
      this.objects.push(obj)
      return true
    }

    if (!this.nodes) {
      this.subdivide()
    }

    for (const node of this.nodes) {
      if (node.insert(obj)) {
        return true
      }
    }

    if (this.objects.length < this.maxObjs) {
      this.objects.push(obj)
      return true
    }

    return false
  }

  query(obj: CollisionObject) : CollisionObject[] {
    if (!this.inBounds(obj.rect)) {
      return null
    }

    let result : CollisionObject[] = this.objects.filter((v) => v.data !== obj.data)

    if (!!this.nodes) {
      for (const node of this.nodes) {
        const innerResult = node.query(obj)
        if (innerResult) {
          result = result.concat(innerResult)
        }
      }
    }
    return result
  }
}