import emptyEvent from './emptyEvent'

export default {
  type: 'element',
  tagName: 'div',
  props: {},
  domProps: {
    class: 'my-element-class',
    onchange: emptyEvent
  },
  children: []
}
