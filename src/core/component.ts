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

  $instance: TInstanceTree | null = null

  setState (stateFn: (prevState: TState) => TState) {
    const oldState = { ...(this.state as Object) }
    const newState = stateFn(oldState)

    if (this.state !== newState) {
      this.state = {
        ...oldState,
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
