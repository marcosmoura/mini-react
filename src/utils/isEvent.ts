function isEvent (propName: string): boolean {
  return propName.startsWith('on')
}

export default isEvent
