import { createInstance, getVNode} from './createInstance'
import patchDom from './patchDom'

type TInstanceTree = TInstance | null

let rootInstanceTree: TInstanceTree

function patchUnknownElement (parentEl: HTMLElement, element: any, instanceTree: TInstanceTree, isRoot: boolean = false): TInstanceTree {
  const newInstance = createInstance(element)
  const newEl = newInstance.domEl

  if (isRoot) {
    parentEl.replaceWith(newEl as Node)
  } else {
    parentEl.appendChild(newEl as Node)
  }

  return newInstance
}

function patchCommentElement (oldEl: Comment, newEl: HTMLElement) {
  oldEl.replaceWith(newEl)
}

function patchNullComponent (oldEl: HTMLElement, instance: TInstance): TInstanceTree {
  const commentProxy = document.createComment(' MiniReact Element ')

  oldEl.replaceWith(commentProxy)

  instance.domEl = commentProxy

  return instance
}

function patchComponentClass (parentEl: HTMLElement, element: any, instanceTree: TInstanceTree, isRoot: boolean = false): TInstanceTree {
  const newInstance = createInstance(element)

  if (newInstance && newInstance.vNode) {
    const newVNode = newInstance.vNode

    newVNode.props = instanceTree.instance.props

    return patch(parentEl, newVNode, instanceTree.componentInstance)
  }

  return patch(parentEl as HTMLElement, null, instanceTree.componentInstance)
}

export function patch (parentEl: HTMLElement, element: any, instanceTree: TInstanceTree, isRoot: boolean = false): TInstanceTree {
  if (!instanceTree) {
    return patchUnknownElement(parentEl, element, instanceTree, isRoot)
  }

  const instanceEl: Comment = instanceTree.domEl as Comment

  if (instanceEl && (instanceEl as Comment).nodeName === '#comment') {
    patchCommentElement(instanceEl, parentEl)

    return instanceTree
  }

  if (!element) {
    return patchNullComponent(parentEl, instanceTree)
  }

  if (element.type === 'component') {
    return patchComponentClass(parentEl, element, instanceTree)
  }

  const currentInstance: TInstance = instanceTree
  const oldVNode = currentInstance.vNode
  const newVNode = getVNode(element)

  currentInstance.vNode = newVNode
  currentInstance.domEl = patchDom(parentEl, oldVNode, newVNode)

  if (newVNode.children) {
    currentInstance.childInstances = patchChildren(parentEl, currentInstance.childInstances, newVNode.children)
  }

  return currentInstance
}

function patchChildren (parentEl: HTMLElement, childInstances: Array<TInstance>, nextChildElements: Array<TVNode> = []) {
  const newChildInstances = []
  const count = Math.max(childInstances.length, nextChildElements.length)

  for (let i = 0; i < count; i++) {
    const childInstance: TInstance = childInstances[i]
    const childElement: TVNode = nextChildElements[i]
    let newChildInstance

    if (childInstance) {
      newChildInstance = patch(childInstance.domEl as HTMLElement, childElement, childInstance)
    } else {
      newChildInstance = patch(parentEl as HTMLElement, childElement, null)
    }

    newChildInstances.push(newChildInstance)
  }

  return newChildInstances
}

function render (Component: TComponent<TProps, TState>, el: HTMLElement) {
  rootInstanceTree = patch(el, Component, rootInstanceTree, true)
}

export default render
