import isClass from '../utils/isClass'

function createComponentInstance (Component: TInstanceElement, props: TProps) {
  let componentInstance = null

  if (isClass(Component)) {
    componentInstance = new Component(props)
  } else {
    componentInstance = Component
  }

  return componentInstance
}

export default createComponentInstance
