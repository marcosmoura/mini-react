import isClass from '../utils/isClass'
import deepFreeze from '../utils/deepFreeze'

function createComponentInstance (Component: TInstanceElement, props: TProps) {
  let componentInstance = null

  if (isClass(Component)) {
    componentInstance = new Component(deepFreeze(props))
  } else {
    componentInstance = Component
  }

  return componentInstance
}

export default createComponentInstance
