import createElement from './createElement'
import createComponentInstance from '../core/createComponentInstance'

export function getVNode (element: any) {
  if (element.render) {
    return element.render()
  }

  return element
}

export function createInstance (element: any) {
  let vNode: TVNode = getVNode(element)

  if (vNode.type !== 'component') {
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
