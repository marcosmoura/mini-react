import { createInstance, getVNode } from '@/dom/createInstance'
import createComponentInstance from '@/core/createComponentInstance'
import vNodeWithTagName from 'test/fixtures/vNodeWithTagName'
import vNodeWithTagNameAndChildren from 'test/fixtures/vNodeWithTagNameAndChildren'
import vNodeWithComponentClass from 'test/fixtures/vNodeWithComponentClass'
import ComponentClass from 'test/fixtures/componentClass';

function checkSingleInstance (instance: TInstance) {
  const domEl: HTMLElement = instance.domEl as HTMLElement

  expect(Array.isArray(instance.childInstances)).toBe(true)
  expect(domEl.outerHTML).toEqual('<div></div>')
  expect(instance.vNode).toEqual(vNodeWithTagName)
}

it('correctly gets the vNode based on an already set vNode', () => {
  const vNode = getVNode(vNodeWithTagName)

  expect(vNode).toEqual(vNodeWithTagName)
})

it('correctly gets the vNode based on a component instance', () => {
  const newElement = createComponentInstance(ComponentClass)
  const vNode = getVNode(newElement)
  const instance = createInstance(vNode)

  expect(vNode).toEqual(vNodeWithTagName)
  checkSingleInstance(instance)
})

it('throw error when passing invalid VNode', () => {
  const instance = () => createInstance('string')
  let consoleSpy = jest.spyOn(console, 'error').mockImplementation((error: string) => error)

  expect(instance).toThrow('Invalid render function value')
  expect(consoleSpy).toReturnWith('The contents of the render function are invalid')
})

it('create instance with valid structure', () => {
  const instance = createInstance(vNodeWithTagName)

  checkSingleInstance(instance)
})

it('create instance with children', () => {
  const instance = createInstance(vNodeWithTagNameAndChildren)

  expect(Array.isArray(instance.childInstances)).toBeTruthy()

  instance.childInstances.forEach((instance: TInstance) => checkSingleInstance(instance))
})

it('create instance based on a componentClass', () => {
  const instance = createInstance(vNodeWithComponentClass)

  checkSingleInstance(instance)
  expect(instance.instance).toBeTruthy()
})


