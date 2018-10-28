import { createInstance, getVNode } from './createInstance'
import patchDom from './patchDom'
import createComponentInstance from 'core/createComponentInstance'

let rootInstanceTree

function patchNewInstance (el, element, replaceEL) {
  if (!element) {
    return null
  }

  const newInstance = createInstance(element)

  if (newInstance) {
    if (replaceEL) {
      el.replaceWith(newInstance.domEl)
    } else {
      el.appendChild(newInstance.domEl)
    }
  }

  return newInstance
}

function patchInstanceCommentProxy (el, element) {
  const newVNode = getVNode(element)

  return patch(el, newVNode, null, true)
}

function removeDomNode (el) {
  el.parentNode.removeChild(el)

  return null
}

function createCommentProxy (el, instanceTree) {
  const commentProxy = document.createComment(' MINIREACT ELEMENT ')

  instanceTree.domEl = commentProxy

  el.replaceWith(instanceTree.domEl)

  return instanceTree
}

function patchInstanceComponent (el, element, instanceTree) {
  const currentInstance: TInstance = instanceTree
  const oldVNode = currentInstance.vNode
  const newVNode = getVNode(element)

  if (!newVNode) {
    return patch(el, null, instanceTree)
  }

  if (newVNode.component) {
    const componentInstance = createComponentInstance(element.component, newVNode.props)

    return patch(el, componentInstance, instanceTree)
  }

  if (oldVNode.tagName !== newVNode.tagName) {
    return patch(el, newVNode, null, true)
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

export function patch (el, element, instanceTree, replaceEL = false) {
  if (!instanceTree) {
    return patchNewInstance(el, element, replaceEL)
  }

  if (instanceTree.domEl && instanceTree.domEl.nodeName === '#comment') {
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

function patchChildren (parentEl, childInstances, childElements) {
  const newChildInstances = []
  const count = Math.max(childInstances.length, childElements.length)

  for (let i = 0; i < count; i++) {
    const childInstance: TInstance = childInstances[i]
    const childElement: TVNode = childElements[i]
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

function render (component, el) {
  rootInstanceTree = patch(el, component, rootInstanceTree, true)
}

export default render
