import { createInstance, getVNode} from './createInstance'
import patchDom from './patchDom'

type TInstanceTree = TInstance | null

let rootInstanceTree: TInstanceTree

export function patch (parentEl: HTMLElement, element: any, instanceTree: TInstanceTree, isRoot?: boolean): TInstanceTree {
  if (!instanceTree) {
    const newInstance = createInstance(element)
    const newEl = newInstance.domEl

    if (isRoot) {
      parentEl.replaceWith(newEl as Node)
    } else {
      parentEl.appendChild(newEl as Node)
    }

    return newInstance
  }

  if (!element) {
    parentEl.removeChild(instanceTree.domEl as Node)

    return null
  }

  const oldVNode = instanceTree.vNode

  if (element.type === 'component') {
    const newInstance = createInstance(element)
    const newVNode = newInstance.vNode

    newVNode.props = instanceTree.instance.props

    return patch(parentEl, newVNode, instanceTree.componentInstance)
  }

  const currentInstance: TInstance = instanceTree
  const newVNode = getVNode(element)

  instanceTree.vNode = newVNode
  instanceTree.domEl = patchDom(parentEl, oldVNode, newVNode)

  if (newVNode.children) {
    patchChildren(currentInstance.childInstances, newVNode.children)
  }

  return currentInstance
}

function patchChildren (childInstances: Array<TInstance>, nextChildElements: Array<TVNode> = []) {
  const newChildInstances = []
  const count = Math.max(childInstances.length, nextChildElements.length)

  for (let i = 0; i < count; i++) {
    const childInstance: TInstance = childInstances[i]
    const childElement: TVNode = nextChildElements[i]
    const newChildInstance = patch(childInstance.domEl as HTMLElement, childElement, childInstance)

    newChildInstances.push(newChildInstance)
  }

  return newChildInstances
}

function render (Component: TComponent<TProps, TState>, el: HTMLElement) {
  rootInstanceTree = patch(el, Component, rootInstanceTree, true)
}

export default render
