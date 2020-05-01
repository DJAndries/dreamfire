
const eventHandleChain = (ev : any, handlers : Function[]) : boolean => {
  for (const handler of handlers) {
    if (handler(ev)) {
      return true
    }
  }
  return false
}

export default eventHandleChain