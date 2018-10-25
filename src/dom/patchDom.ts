import isEvent from '../utils/isEvent'
import patchEvents from './patchEvents'

function patchDom (el: HTMLElement, prevVNode: TVNode, nextVNode: TVNode, isCreating?: boolean) {
  if (nextVNode.type == 'text') {
    if (nextVNode.textContent && prevVNode.textContent != nextVNode.textContent) {
      el.textContent = nextVNode.textContent.toString()
    }

    return el
  }

  const prevProps = prevVNode.domProps
  const nextProps = nextVNode.domProps
  const prevPropsNames = Object.keys(prevProps)
  const nextPropsNames = Object.keys(nextProps)

  prevPropsNames
    .filter((propName) => !nextPropsNames.includes(propName))
    .forEach((propName: string) => el.removeAttribute(propName))

  if (isCreating) {
    nextPropsNames.forEach((propName: string) => !isEvent(propName) && el.setAttribute(propName, nextProps[propName]))
  } else {
    nextPropsNames
      .filter((propName) => nextProps[propName] !== prevProps[propName] && !isEvent(propName))
      .forEach((propName: string) => {
        el.setAttribute(propName, nextProps[propName])
        el[propName] = nextProps[propName]
      })
  }

  return patchEvents(el, prevVNode, nextVNode)
}

export default patchDom
