function createVNode (node: TRawNode): TVNode {
  const { tagName, textContent, children, props, componentClass: component, ...domProps } = node
  const vNode: TVNode = {
    type: 'component',
    props: props || {},
    domProps: domProps || {},
    children: children || []
  }

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
