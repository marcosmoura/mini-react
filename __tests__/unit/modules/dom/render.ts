import render from '@/dom/render'
import node from '@/core/createVNode'
import Component from '@/core/component'

const rootEl = document.createElement('div')

rootEl.id = 'root'
document.body.appendChild(rootEl)

it('create root instance', () => {
  class MyApp extends Component {
    render () {
      return node({
        tagName: 'div',
        id: 'app'
      })
    }
  }

  expect(rootEl.outerHTML).toBe('<div id="root"></div>')
  render(new MyApp(), rootEl)
  expect(document.getElementById('app').outerHTML).toBe('<div id="app"></div>')
})

it('create dom element with valid event', () => {
  const consoleSpy = jest.spyOn(console, 'log').mockImplementation((log: string) => log)

  class MyApp extends Component {
    onclick () {
      console.log('On input')
    }

    render () {
      return node({
        tagName: 'div',
        id: 'app',
        onclick: this.onclick
      })
    }
  }

  render(new MyApp(), rootEl)

  const element = document.getElementById('app')

  element.click()

  expect(element.outerHTML).toBe('<div id="app"></div>')
  // expect(consoleSpy).toReturnWith('On input')

  jest.restoreAllMocks()
})

/* it('create element instance with event', () => {
  render(new ComponentClassWithDomProps(), rootEl)

  const newElement = document.body.querySelector('.my-element-class')

  newElement.click()

  expect(.outerHTML).toBe('<div class="my-element-class"></div>')
}) */
