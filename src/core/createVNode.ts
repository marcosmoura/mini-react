import isEvent from '../utils/isEvent'
import isFunction from '../utils/isFunction'
import isClass from '../utils/isClass'
import isValidTextContent from '../utils/isValidTextContent'
import throwError from '../utils/throwError'

function validateVNode (node: TRawNode): void {
  const { componentClass: component, tagName, children, textContent, props, ...domProps } = node


  if (!component && !tagName && !isValidTextContent(textContent)) {
    throwError('VNODE', 'The node is missing a component or a valid tagName', node)
  }

  if (component && !isClass(component)) {
    throwError('VNODE', 'The componentClass is not a valid class Component', node)
  }

  if (component && tagName) {
    console.warn('When tagName and componentClass are provided, the tagName will be ignored', node)
  }

  if (children && !Array.isArray(children)) {
    throwError('VNODE', 'The children is not a valid Array', node)
  }

  if (props && (Array.isArray(props) || typeof props !== 'object')) {
    throwError('VNODE', 'The props is not a valid Object', node)
  }

  if (!component && props) {
    console.warn('The props attribute only works with componentClass', node)
  }

  Object.keys(domProps).forEach((propName) => {
    if (isEvent(propName) && !isFunction(domProps[propName])) {
      throwError('VNODE', `The "${propName}" event is not a valid Function`, node)
    }
  })
}

function createVNode (node: TRawNode): TVNode {
  const { tagName, textContent, children, props, componentClass: component, ...domProps } = node
  const vNode: TVNode = {
    type: 'component',
    props: props || {},
    domProps: domProps || {},
    children: children || []
  }

  validateVNode(node)

  if (component) {
    vNode.component = component
  } else if (tagName) {
    vNode.tagName = tagName
    vNode.type = 'element'
  }

  if (isValidTextContent(textContent) && vNode.children) {
    const textVNode: TVNode = {
      domProps: {},
      props: {},
      textContent,
      type: 'text'
    }

    if (tagName || component) {
      vNode.children.unshift(textVNode)
    } else {
      return textVNode
    }
  }

  return vNode
}

export default createVNode
