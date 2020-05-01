import { DCoords } from '../gfx/types'
import BaseGameContext from '../ctx/BaseGameContext'

export { default as gql } from 'graphql-tag'
export { Observable } from 'apollo-client/util/Observable'

export const testPointWithinBox = (point : DCoords, box : DCoords) : boolean => {
  return point.x >= box.x && point.y >= box.y && point.x < (box.x + box.width) && point.y < (box.y + box.height)
}