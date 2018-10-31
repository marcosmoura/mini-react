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

it('create root instance with child', () => {
  class RootInstance extends Component {
    render () {
      return node({
        tagName: 'div',
        id: 'app',
        children: [
          node({
            tagName: 'div',
            id: 'child'
          })
        ]
      })
    }
  }

  const rootEl = document.getElementById('root')

  expect(rootEl.outerHTML).toBe('<div id="root"></div>')
  render(new RootInstance(), rootEl)
  expect(document.getElementById('app').outerHTML).toBe('<div id="app"><div id="child"></div></div>')
})

it('create root instance with child as a subcomponent', () => {
  class SubComponent extends Component {
    render () {
      return node({
        tagName: 'div',
        id: 'child'
      })
    }
  }

  class RootInstance extends Component {
    render () {
      return node({
        tagName: 'div',
        id: 'app',
        children: [
          node({
            componentClass: SubComponent
          })
        ]
      })
    }
  }

  const rootEl = document.getElementById('root')

  expect(rootEl.outerHTML).toBe('<div id="root"></div>')
  render(new RootInstance(), rootEl)
  expect(document.getElementById('app').outerHTML).toBe('<div id="app"><div id="child"></div></div>')
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

it('create proxy comment when the component vNode become null', () => {
  class ReRenderInstance extends Component {
    state = {
      hide: false
    }

    onClick = () => this.setState({ hide: true })

    render () {
      return !this.state.hide ? node({
        tagName: 'div',
        id: 'app',
        onclick: this.onClick
      }) : null
    }
  }

  const rootEl = document.getElementById('root')

  expect(rootEl.outerHTML).toBe('<div id="root"></div>')
  render(new ReRenderInstance(), rootEl)

  const el = document.getElementById('app')
  expect(el.outerHTML).toBe('<div id="app"></div>')

  app.click()

  const newEl = document.getElementById('app')
  expect(newEl).toBeFalsy()
  expect(document.body.childNodes[0].nodeName).toBe('#comment')
})

it('restore element when a render function that returned null starts to return a valid VNode', (done: () => any) => {
  class ReRenderInstance extends Component {
    state = {
      hide: false
    }

    onClick = () => {
      setTimeout(() => {
        this.setState({ hide: false })
      }, 10)
      this.setState({ hide: true })
    }

    render () {
      return !this.state.hide ? node({
        tagName: 'div',
        id: 'app',
        onclick: this.onClick
      }) : null
    }
  }

  const rootEl = document.getElementById('root')

  expect(rootEl.outerHTML).toBe('<div id="root"></div>')
  render(new ReRenderInstance(), rootEl)

  const el = document.getElementById('app')
  expect(el.outerHTML).toBe('<div id="app"></div>')

  app.click()

  const newEl = document.getElementById('app')
  expect(newEl).toBeFalsy()
  expect(document.body.childNodes[0].nodeName).toBe('#comment')

  setTimeout(() => {
    const newEl = document.getElementById('app')
    expect(newEl).toBeTruthy()
    expect(newEl.outerHTML).toBe('<div id="app"></div>')
    done()
  }, 20)
})

it('replace element when tagName changes', () => {
  class ReRenderInstance extends Component {
    state = {
      tagName: 'div'
    }

    onClick = () => this.setState({ tagName: 'section' })

    render () {
      return node({
        tagName: this.state.tagName,
        id: 'app',
        onclick: this.onClick
      })
    }
  }

  const rootEl = document.getElementById('root')

  expect(rootEl.outerHTML).toBe('<div id="root"></div>')
  render(new ReRenderInstance(), rootEl)

  const app = document.getElementById('app')
  expect(app.outerHTML).toBe('<div id="app"></div>')

  app.click()

  const newApp = document.getElementById('app')
  expect(newApp.outerHTML).toBe('<section id="app"></section>')

  // Make sure is the same dom node
  expect(app).not.toBe(newApp)
})

it('rerender child as a subcomponent', () => {
  class SubComponent extends Component {
    render () {
      return node({
        tagName: 'div',
        id: this.props.componentId
      })
    }
  }

  class RootInstance extends Component {
    state = {
      componentId: 'child'
    }

    render () {
      return node({
        tagName: 'div',
        id: 'app',
        onclick: () => this.setState({ componentId: 'child-patch' }),
        children: [
          node({
            componentClass: SubComponent,
            props: {
              componentId: this.state.componentId
            }
          })
        ]
      })
    }
  }

  const rootEl = document.getElementById('root')

  expect(rootEl.outerHTML).toBe('<div id="root"></div>')
  render(new RootInstance(), rootEl)

  const appEl = document.getElementById('app')
  expect(appEl.outerHTML).toBe('<div id="app"><div id="child"></div></div>')

  appEl.click()

  expect(appEl.outerHTML).toBe('<div id="app"><div id="child-patch"></div></div>')
})

it('rerender component with new children', () => {
  class ReRenderInstance extends Component {
    state = {
      child: 1
    }

    onClick = () => this.setState({ child: 2 })

    render () {
      const child1 = node({
        tagName: 'div'
      })
      const child2 = node({
        tagName: 'span'
      })

      return node({
        tagName: 'div',
        id: 'app',
        children: this.state.child === 1 ? [child1] : [child2],
        onclick: this.onClick
      })
    }
  }

  const rootEl = document.getElementById('root')

  expect(rootEl.outerHTML).toBe('<div id="root"></div>')
  render(new ReRenderInstance(), rootEl)

  const app = document.getElementById('app')
  const childEl = app.childNodes[0]
  expect(app.outerHTML).toBe('<div id="app"><div></div></div>')

  app.click()
  expect(app.outerHTML).toBe('<div id="app"><span></span></div>')

  // Make sure is the same dom node
  const newChildEl = app.childNodes[0]
  expect(app).toBe(document.getElementById('app'))
  expect(childEl).not.toBe(newChildEl)
})

it('rerender component with more children', () => {
  class ReRenderInstance extends Component {
    state = {
      childNumber: 1
    }

    onClick = () => this.setState({ childNumber: 2 })

    render () {
      const child1 = node({
        tagName: 'div'
      })
      const child2 = node({
        tagName: 'span'
      })
      let children = [child1]

      if (this.state.childNumber === 2) {
        children = [child1, child2]
      }

      return node({
        tagName: 'div',
        id: 'app',
        children,
        onclick: this.onClick
      })
    }
  }

  const rootEl = document.getElementById('root')

  expect(rootEl.outerHTML).toBe('<div id="root"></div>')
  render(new ReRenderInstance(), rootEl)

  const app = document.getElementById('app')
  expect(app.childNodes.length).toBe(1)
  expect(app.outerHTML).toBe('<div id="app"><div></div></div>')

  app.click()
  expect(app.childNodes.length).toBe(2)
  expect(app.outerHTML).toBe('<div id="app"><div></div><span></span></div>')
})

it('rerender component with no children', () => {
  class ReRenderInstance extends Component {
    state = {
      childNumber: 1
    }

    onClick = () => this.setState({ childNumber: 0 })

    render () {
      let children = [
        node({
          tagName: 'div'
        })
      ]

      if (this.state.childNumber === 0) {
        children.length = 0
      }

      return node({
        tagName: 'div',
        id: 'app',
        children,
        onclick: this.onClick
      })
    }
  }

  const rootEl = document.getElementById('root')

  expect(rootEl.outerHTML).toBe('<div id="root"></div>')
  render(new ReRenderInstance(), rootEl)

  const app = document.getElementById('app')
  expect(app.childNodes.length).toBe(1)
  expect(app.outerHTML).toBe('<div id="app"><div></div></div>')

  app.click()
  expect(app.childNodes.length).toBe(0)
  expect(app.outerHTML).toBe('<div id="app"></div>')
  expect(app).toBe(document.getElementById('app'))
})
