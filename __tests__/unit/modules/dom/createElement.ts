import createElement from '@/dom/createElement'
import vNodeWithTagName from 'test/fixtures/vNodeWithTagName'
import vNodeWithTextContent from 'test/fixtures/vNodeWithTextContent'
import vNodeWithDomProps from 'test/fixtures/vNodeWithDomProps'

it('create an element based on a VNode with tagName', () => {
  const element = createElement(vNodeWithTagName)

  expect(element.outerHTML).toBe('<div></div>')
})

it('create an element based on a VNode with textContent', () => {
  const element = createElement(vNodeWithTextContent)

  expect(element.textContent).toBe('Test')
})

it('create an element based on a VNode with domProps', () => {
  const element = createElement(vNodeWithDomProps)

  expect(element.outerHTML).toBe('<div class="my-element-class"></div>')
})

it('create an element based on a VNode with an event', () => {
  const consoleSpy = jest.spyOn(console, 'log').mockImplementation((error: string) => error)
  const element = createElement({
    ...vNodeWithTagName,
    domProps: {
      onclick: () => console.log('On Click')
    }
  })

  element.click()

  expect(element.outerHTML).toBe('<div></div>')
  expect(consoleSpy).toReturnWith('On Click')

  jest.restoreAllMocks()
})
