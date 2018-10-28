import isEvent from '../utils/isEvent'
import patchEvents from './patchEvents'

function patchDom (el: TElement, prevVNode: TVNode, nextVNode: TVNode, isCreating?: boolean) {
  const elementToPatch: HTMLElement = el as HTMLElement

  if (nextVNode.type == 'text') {
    if (nextVNode.textContent && prevVNode.textContent != nextVNode.textContent) {
      elementToPatch.textContent = nextVNode.textContent.toString()
    }

    return el
  }

  const prevProps = prevVNode.domProps
  const nextProps = nextVNode.domProps
  const prevPropsNames = Object.keys(prevProps)
  const nextPropsNames = Object.keys(nextProps)

  prevPropsNames
    .filter((propName) => !nextPropsNames.includes(propName))
    .forEach((propName: string) => elementToPatch.removeAttribute(propName))

  if (isCreating) {
    nextPropsNames.forEach((propName: string) => !isEvent(propName) && elementToPatch.setAttribute(propName, nextProps[propName]))
  } else {
    nextPropsNames
      .filter((propName) => nextProps[propName] !== prevProps[propName] && !isEvent(propName))
      .forEach((propName: string) => {
        elementToPatch.setAttribute(propName, nextProps[propName])
        elementToPatch[propName] = nextProps[propName]
      })
  }

  return patchEvents(elementToPatch, prevVNode, nextVNode)
}

export default patchDom
