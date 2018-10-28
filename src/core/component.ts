import { patch } from '../dom/render'

function reRender (ctx: any) {
  const context = ctx.$instance
  const domEl = context.domEl as Node

  if (domEl) {
    ctx.$instance = patch(domEl as HTMLElement, context.instance, context)
  }
}

class Component<P = {}, S = {}> implements TComponent<P, S> {

  constructor (props: P) {
    this.props = props
  }

  props: {
    children?: TChildren
  } & P

  state: S | Object = {}

  $instance: TInstance | null = null

  setState (stateFn: () => TState) {
    const newState = stateFn()

    if (this.state !== newState) {
      this.state = {
        ...this.state,
        ...newState
      }

      reRender(this)
    }
  }

  render () {
    return null
  }

}

export default Component
