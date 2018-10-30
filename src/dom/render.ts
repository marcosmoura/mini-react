import { createInstance, getVNode } from './createInstance'
import patchDom from './patchDom'
import createComponentInstance from '../core/createComponentInstance'

function patchNewInstance (el: HTMLElement, element: TInstanceElement, replaceEL: boolean): TInstanceTree {
  if (!element) {
    return null
  }

  const newInstance = createInstance(element)

  if (newInstance) {
    const domEl: HTMLElement = newInstance.domEl as HTMLElement

    if (replaceEL) {
      if (el.replaceWith) {
        el.replaceWith(domEl)
      } else {
        el.outerHTML = domEl.outerHTML
      }
    } else {
      el.appendChild(domEl)
    }
  }

  return newInstance
}

function patchInstanceCommentProxy (el: TElement, element: TInstanceElement): TInstanceTree {
  const newVNode = getVNode(element)

  return patch(el as HTMLElement, newVNode, null, true)
}

function removeDomNode (el: HTMLElement): null {
  if (el.parentNode) {
    el.parentNode.removeChild(el)
  }

  return null
}

function createCommentProxy (el: HTMLElement, instanceTree: TInstanceTree): TInstanceTree {
  const commentProxy = document.createComment(' MINIREACT ELEMENT ')

  if (instanceTree) {
    instanceTree.domEl = commentProxy

    el.replaceWith(instanceTree.domEl)

    return instanceTree
  }

  return null
}

function patchInstanceComponent (el: HTMLElement, element: TInstanceElement, instanceTree: TInstanceTree): TInstanceTree {
  const currentInstance: TInstanceTree = instanceTree

  if (!currentInstance) {
    return null
  }

  const oldVNode = currentInstance.vNode
  const newVNode = getVNode(element)

  if (!newVNode) {
    return patch(el, null, instanceTree)
  }

  if (newVNode.component) {
    if (element && element.component) {
      const newElement = createComponentInstance(element.component, element.props)
      const newInstance = createInstance(newElement)

      if (newInstance && instanceTree) {
        newInstance.domEl = instanceTree.domEl
        newInstance.childInstances = instanceTree.childInstances
        newInstance.vNode.props = element.props

        return patch(instanceTree.domEl as HTMLElement, newInstance.vNode, newInstance)
      }

      return patch(el, null, instanceTree)
    }

    return null
  }

  if (oldVNode.tagName !== newVNode.tagName) {
    let newInstance = patchNewInstance(el, newVNode, true)

    newInstance = Object.assign({}, instanceTree, newInstance)

    return newInstance
  }

  currentInstance.vNode = newVNode
  currentInstance.domEl = patchDom(el, oldVNode, newVNode)

  if (newVNode.children) {
    currentInstance.childInstances = patchChildren(el, currentInstance.childInstances, newVNode.children)
  } else {
    currentInstance.childInstances = []
  }

  return currentInstance
}

export function patch (el: HTMLElement, element: TInstanceElement, instanceTree: TInstanceTree, replaceEL = false): TInstanceTree {
  if (!instanceTree) {
    return patchNewInstance(el, element, replaceEL)
  }

  const commentEl: Comment = instanceTree.domEl as Comment

  if (commentEl && commentEl.nodeName === '#comment') {
    return patchInstanceCommentProxy(el, element)
  }

  if (!element && el.parentNode) {
    if (!instanceTree.instance) {
      return removeDomNode(el)
    }

    return createCommentProxy(el, instanceTree)
  }

  return patchInstanceComponent(el, element, instanceTree)
}

function patchChildren (el: HTMLElement, childInstances: Array<TInstanceTree>, childElements: TChildren) {
  if (childInstances) {
    const newChildInstances = []
    const count = Math.max(childInstances.length, childElements.length)

    for (let i = 0; i < count; i++) {
      const childInstance: TInstanceTree = childInstances[i]
      const childElement: TVNode = childElements[i]
      let newChildInstance

      if (childInstance) {
        newChildInstance = patch(childInstance.domEl as HTMLElement, childElement, childInstance)
      } else {
        newChildInstance = patch(el as HTMLElement, childElement, null)
      }

      newChildInstances.push(newChildInstance)
    }

    return newChildInstances
  }

  return []
}

function render (component: TInstanceElement, el: HTMLElement) {
  patch(el, component, null, true)
}

export default render
