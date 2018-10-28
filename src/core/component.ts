import { patch } from '../dom/render'
import isFunction from '../utils/isFunction'

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

  setState (newComponentState: (prevState: TState) => TState | TState) {
    const oldState = { ...(this.state as Object) }
    let newState: TState

    if (isFunction(newComponentState)) {
      newState = { ...newComponentState(oldState) }
    } else {
      newState = { ...newComponentState }
    }

    if (this.state !== newState) {
      this.state = Object.freeze({
        ...oldState,
        ...newState
      })

      reRender(this)
    }
  }

  render () {
    return null
  }

}

export default Component
