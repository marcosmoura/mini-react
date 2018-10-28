function isClass (clazz: any): boolean {
  return typeof clazz === 'function' && /_class\S+/i.test(clazz.toString())
}

export default isClass
