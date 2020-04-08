import { PubSub, withFilter, FilterFn } from 'apollo-server'
export { FilterFn } from 'apollo-server'

export const pubsub = new PubSub()

export const publish = (eventName : string, payload) => {
  pubsub.publish(eventName, { [eventName]: payload })
}

export const subscribe = (eventName : string, filterFunc : FilterFn) => {
  return withFilter(
    () => pubsub.asyncIterator([eventName]),
    filterFunc
  )
}
