function isFunction (fn: () => void): boolean {
  return Object.prototype.toString.call(fn) == '[object Function]'
}

export default isFunction
