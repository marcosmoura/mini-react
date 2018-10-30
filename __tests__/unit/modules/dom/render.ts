import render from '@/dom/render'
import node from '@/core/createVNode'
import Component from '@/core/component'

beforeEach(() => {
  const rootEl = document.createElement('div')

  document.body.innerHTML = ''
  rootEl.id = 'root'
  document.body.appendChild(rootEl)
})

it('create root instance', () => {
  class RootInstance extends Component {
    render () {
      return node({
        tagName: 'div',
        id: 'app'
      })
    }
  }

  const rootEl = document.getElementById('root')

  expect(rootEl.outerHTML).toBe('<div id="root"></div>')
  render(new RootInstance(), rootEl)
  expect(document.getElementById('app').outerHTML).toBe('<div id="app"></div>')
})

it('create dom element with valid event', () => {
  const consoleSpy = jest.spyOn(console, 'log').mockImplementation((log: string) => log)

  class EventInstance extends Component {
    render () {
      return node({
        tagName: 'div',
        id: 'app',
        onclick: () => console.log('On click')
      })
    }
  }

  render(new EventInstance(), document.getElementById('root'))

  const element = document.getElementById('app')

  element.click()

  expect(element.outerHTML).toBe('<div id="app"></div>')
  expect(consoleSpy).toReturnWith('On click')

  jest.restoreAllMocks()
})
