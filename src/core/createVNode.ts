import isEvent from 'utils/isEvent'
import isFunction from 'utils/isFunction'

function throwVNodeError () {
  throw new Error('Invalid Node')
}

function validateVNode (node: TRawNode): void {
  const { componentClass: component, tagName, children, props, ...domProps } = node

  if (!component && !tagName) {
    console.error('The node is missing a component or a valid tagName', node)
    throwVNodeError()
  }

  if (children && !Array.isArray(children)) {
    console.error('The children is not a valid Array', node)
    throwVNodeError()
  }

  if (props && (Array.isArray(props) || typeof props !== 'object')) {
    console.error('The props is not a valid Object', node)
    throwVNodeError()
  }

  Object.keys(domProps).forEach((propName) => {
    if (isEvent(propName) && !isFunction(domProps[propName])) {
      console.error(`The "${propName}" event is not a valid Function`, node)
      throwVNodeError()
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

  if (textContent && vNode.children) {
    vNode.children.unshift({
      domProps: {},
      props: {},
      textContent,
      type: 'text'
    })
  }

  return vNode
}

export default createVNode
