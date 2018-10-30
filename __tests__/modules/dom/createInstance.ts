import { createInstance, getVNode } from '@/dom/createInstance'
import vNodeWithTagName from 'test/fixtures/vNodeWithTagName'
import vNodeWithTagNameAndChildren from 'test/fixtures/vNodeWithTagNameAndChildren'

function checkSingleInstance (instance: TInstance) {
  const domEl: HTMLElement = instance.domEl as HTMLElement

  expect(Array.isArray(instance.childInstances)).toBeTruthy()
  expect(domEl.outerHTML).toEqual('<div></div>')
  expect(instance.vNode).toEqual(vNodeWithTagName)
}

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


