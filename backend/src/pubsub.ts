import { PubSub, withFilter, FilterFn } from 'apollo-server'
export { FilterFn } from 'apollo-server'

export const pubsub = new PubSub()

export const publish = (eventName : string, payload : any, customInfo : object = null) => {
  pubsub.publish(eventName, Object.assign({ [eventName]: payload }, customInfo))
}

export const subscribe = (eventName : string, filterFunc : FilterFn) => {
  return withFilter(
    () => pubsub.asyncIterator([eventName]),
    filterFunc
  )
}
