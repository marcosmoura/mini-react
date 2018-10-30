import MiniReact from '@/'
import { Component, render, node } from '@/'

it('create MiniReact library API', () => {
  expect(MiniReact).toBeTruthy()
  expect(MiniReact.render).toBeTruthy()
  expect(typeof render).toBe('function')
  expect(MiniReact.Component).not.toBeTruthy()
  expect(MiniReact.node).not.toBeTruthy()
})

it('create MiniReact subimports', () => {
  expect(render).toBeTruthy()
  expect(typeof render).toBe('function')
  expect(render).toBe(MiniReact.render)
  expect(Component).toBeTruthy()
  expect(typeof Component).toBe('function')
  expect(node).toBeTruthy()
  expect(typeof node).toBe('function')
})

it('create MiniReact window bindings', () => {
  expect(window.MiniReact).toBeTruthy()
  expect(window.Component).toBeTruthy()
  expect(window.node).toBeTruthy()

  expect(window.MiniReact.render).toBe(MiniReact.render)
  expect(window.Component).toBe(Component)
  expect(window.node).toBe(node)
})
