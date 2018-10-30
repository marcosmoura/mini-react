import Component from './core/component'
import node from './core/createVNode'
import render from './dom/render'

const w = window as any

w.Component = Component
w.node = node
w.MiniReact = {
  render
}

export {
  render,
  Component,
  node
}

export default { render }
