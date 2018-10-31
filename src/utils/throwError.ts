import errorList from './errorList'

function throwError (type: string, message?: string, content?: any): Error {
  let error = errorList[type]

  console.error(message, content)
  throw new Error(error)
}

export default throwError
