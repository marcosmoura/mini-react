import patchDom from '@/dom/patchDom'
import createElement from '@/dom/createElement'
import vNodeWithDomProps from 'test/fixtures/vNodeWithDomProps'

it('patch dom element based on a different vNode', () => {
  const newVNode = {
    ...vNodeWithDomProps,
    domProps: {
      class: 'another-class',
      style: 'width: 50px;'
    }
  }
  const element = createElement(vNodeWithDomProps)

  expect(element.outerHTML).toBe('<div class="my-element-class"></div>')
  patchDom(element, vNodeWithDomProps, newVNode)
  expect(element.outerHTML).toBe('<div class="another-class" style="width: 50px;"></div>')
})

it('patch dom element removing attributes', () => {
  const newVNode = {
    ...vNodeWithDomProps,
    domProps: {}
  }
  const element = createElement(vNodeWithDomProps)

  expect(element.outerHTML).toBe('<div class="my-element-class"></div>')
  patchDom(element, vNodeWithDomProps, newVNode)
  expect(element.outerHTML).toBe('<div></div>')
})

it('patch dom element based on a different vNode with event', () => {
  const consoleSpy = jest.spyOn(console, 'log').mockImplementation((error: string) => error)
  const newVNode = {
    ...vNodeWithDomProps,
    domProps: {
      onclick: () => console.log('On Click')
    }
  }
  const element = createElement(vNodeWithDomProps)

  element.click()

  expect(element.outerHTML).toBe('<div class="my-element-class"></div>')
  patchDom(element, vNodeWithDomProps, newVNode)
  element.click()
  element.click()
  element.click()
  expect(element.outerHTML).toBe('<div></div>')
  expect(consoleSpy).toReturnWith('On Click')
  expect(consoleSpy).toHaveBeenCalledTimes(3)

  jest.restoreAllMocks()
})

it('patch dom element removing events', () => {
  const consoleSpy = jest.spyOn(console, 'log').mockImplementation((error: string) => error)
  const newVNode = vNodeWithDomProps
  const oldVNode = {
    ...vNodeWithDomProps,
    domProps: {
      ...vNodeWithDomProps.domProps,
      onclick: () => console.log('On Click')
    }
  }
  const element = createElement(oldVNode)

  element.click()

  expect(element.outerHTML).toBe('<div class="my-element-class"></div>')
  expect(consoleSpy).toReturnWith('On Click')
  patchDom(element, oldVNode, newVNode)

  consoleSpy.mockClear()

  element.click()
  element.click()
  element.click()
  expect(element.onclick).toBeFalsy()
  expect(element.outerHTML).toBe('<div class="my-element-class"></div>')
  expect(consoleSpy).not.toReturnWith('On Click')
  expect(consoleSpy).toHaveBeenCalledTimes(0)

  jest.restoreAllMocks()
})
