const isClass = (clazz: any): boolean => {
  return typeof clazz === 'function' && /^\s*class\s+/.test(clazz.toString())
}

export default isClass
