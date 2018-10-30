import createComponentInstance from '../core/createComponentInstance'
import createElement from './createElement'
import throwError from '../utils/throwError'
import deepFreeze from '../utils/deepFreeze'

export function getVNode (element: any): TInstanceElement {
  let newElement = element

  if (element.render) {
    newElement = element.render()
  }

  if (newElement != null && typeof newElement != 'object') {
    let errorContent = newElement

    if (element.render) {
      errorContent = {
        component: element,
        render: newElement
      }
    }

    throwError('RENDER', 'The contents of the render function are invalid', errorContent)
  }

  if (!newElement) {
    return null
  }

  if (element.props) {
    newElement.props = deepFreeze({
      ...newElement.props,
      ...element.props
    })
  }

  return newElement
}

export function createInstance (element: TInstanceElement): TInstanceTree {
  let vNode: TVNode = getVNode(element)

  if (vNode === null) {
    return null
  } else if (vNode.type !== 'component') {
    const domEl: TElement = createElement(vNode)
    const rawInstance: TInstance = {
      domEl,
      vNode,
      childInstances: []
    }

    if (domEl && vNode.children && vNode.children.length > 0) {
      const childInstances: Array<TInstanceTree> = vNode.children.map(createInstance)

      childInstances.forEach(({ domEl: childDomEl }: TInstanceTree) => (
        childDomEl && (domEl as HTMLElement).appendChild(childDomEl as HTMLElement)
      ))

      rawInstance.childInstances = childInstances
    }

    if (element.render) {
      element.$instance = rawInstance
      rawInstance.instance = element
    }

    return rawInstance
  }

  const componentInstance: any = createComponentInstance(element.component, vNode.props)
  const newInstance: TInstanceTree = createInstance(componentInstance)

  return {
    ...newInstance,
    instance: componentInstance
  }
}
