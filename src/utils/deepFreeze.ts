function deepFreeze (object: any) {
  const newObject = { ...object }
  const propNames = Object.getOwnPropertyNames(newObject)

  for (let name of propNames) {
    let value = newObject[name]
    const isValueObject = value && typeof value === 'object'

    newObject[name] = isValueObject ? deepFreeze(value) : value
  }

  return Object.freeze(newObject)
}

export default deepFreeze
