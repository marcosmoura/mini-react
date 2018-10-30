import createComponentInstance from '../core/createComponentInstance'
import createElement from './createElement'
import throwError from '../utils/throwError'

export function getVNode (element: any): TVNode {
  let newElement = element

  if (element.render) {
    newElement = element.render()
    newElement.props = element.props
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
      rawInstance.instance = element
      element.$instance = rawInstance
    }

    return rawInstance
  }

  const componentInstance: any = createComponentInstance(element.component, vNode.props)
  const newInstance: TInstanceTree = createInstance(componentInstance)

  return {
    ...newInstance,
    instance: componentInstance,
    componentInstance: newInstance
  }
}
