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

  const consoleSpy = jest.spyOn(console, 'log').mockImplementation((log: string) => log)
  const element = document.getElementById('app')

  element.click()

  expect(element.outerHTML).toBe('<div id="app"></div>')
  expect(consoleSpy).toReturnWith('On click')

  jest.restoreAllMocks()
})

it('shallow re render', () => {
  class ReRenderInstance extends Component {
    state = {
      className: 'app'
    }

    onClick = () => this.setState({ className: 'patch' })

    render () {
      return node({
        tagName: 'div',
        id: 'app',
        class: this.state.className,
        onclick: this.onClick
      })
    }
  }

  const rootEl = document.getElementById('root')

  expect(rootEl.outerHTML).toBe('<div id="root"></div>')
  render(new ReRenderInstance(), rootEl)

  const app = document.getElementById('app')
  expect(app.outerHTML).toBe('<div id="app" class="app"></div>')

  app.click()
  expect(app.outerHTML).toBe('<div id="app" class="patch"></div>')

  // Make sure is the same dom node
  expect(app).toBe(document.getElementById('app'))
})
