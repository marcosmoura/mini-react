import createElement from './createElement'
import createComponentInstance from '../core/createComponentInstance'
import throwError from 'utils/throwError'

export function getVNode (element: any): TVNode {
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

    throwError('RENDER', 'The contents of the return function is invalid', errorContent)
  }

  return newElement
}

export function createInstance (element: any) {
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
      const childInstances: Array<TInstance> = vNode.children.map(createInstance)

      childInstances.forEach(({ domEl: childDomEl }: TInstance) => (
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
  const newInstance: TInstance = createInstance(componentInstance)

  return {
    ...newInstance,
    instance: componentInstance,
    componentInstance: newInstance
  }
}
