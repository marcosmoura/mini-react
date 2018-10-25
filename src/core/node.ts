import createVNode from '../core/createVNode'

function node (vNode: TRawNode) {
  return createVNode(vNode)
}

export default node
