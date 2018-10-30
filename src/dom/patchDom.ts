import isEvent from '../utils/isEvent'
import isValidTextContent from '../utils/isValidTextContent'
import patchEvents from './patchEvents'

function getEventName (event: string): string {
  return event.substring(2).toLowerCase()
}

function handleListener (elementToPatch: HTMLElement, propName: string, props: Object, type: string = 'addEventListener') {
  elementToPatch[type](getEventName(propName), props[propName])
}

function setAttribute (elementToPatch: HTMLElement, propName: string, props: Object) {
  elementToPatch.setAttribute(propName, props[propName])
}

function removeAttributesAndEvents (elementToPatch: HTMLElement, prevProps: Object, prevPropsNames: Array<string>, nextPropsNames: Array<string>) {
  prevPropsNames.forEach((propName: string) => {
    if (isEvent(propName)) {
      handleListener(elementToPatch, propName, prevProps, 'removeEventListener')
    } else if (!nextPropsNames.includes(propName)) {
      elementToPatch.removeAttribute(propName)
    }
  })
}

function createAttributesAndEvents (elementToPatch: HTMLElement, nextProps: Object, nextPropsNames: Array<string>) {
  nextPropsNames.forEach((propName: string) => {
    if (isEvent(propName)) {
      handleListener(elementToPatch, propName, nextProps, 'addEventListener')
    } else {
      setAttribute(elementToPatch, propName, nextProps)
    }
  })
}

function patchAttributesAndEvents (elementToPatch: HTMLElement, nextProps: Object, prevProps: Object, nextPropsNames: Array<string>) {
  nextPropsNames
    .forEach((propName: string) => {
      if (isEvent(propName)) {
        handleListener(elementToPatch, propName, nextProps, 'addEventListener')
      } else {
        setAttribute(elementToPatch, propName, nextProps)
        elementToPatch[propName] = nextProps[propName]
      }
    })
}

function patchDom (el: TElement, prevVNode: TVNode, nextVNode: TVNode, isCreating?: boolean): HTMLElement {
  const elementToPatch: HTMLElement = el as HTMLElement

  if (nextVNode.type == 'text') {
    if (isValidTextContent(nextVNode.textContent) && prevVNode.textContent != nextVNode.textContent) {
      elementToPatch.textContent = (nextVNode.textContent as string).toString()
    }

    return elementToPatch
  }

  const prevProps = prevVNode.domProps
  const nextProps = nextVNode.domProps
  const prevPropsNames = Object.keys(prevProps)
  const nextPropsNames = Object.keys(nextProps)

  removeAttributesAndEvents(elementToPatch, prevProps, prevPropsNames, nextPropsNames)

  if (isCreating) {
    createAttributesAndEvents(elementToPatch, nextProps, nextPropsNames)
  } else {
    patchAttributesAndEvents(elementToPatch, nextProps, prevProps, nextPropsNames)
  }

  return patchEvents(elementToPatch, prevVNode, nextVNode)
}

export default patchDom
