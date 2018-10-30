import { patch } from '../dom/render'
import isFunction from '../utils/isFunction'
import deepFreeze from '../utils/deepFreeze'

function reRender (ctx: any) {
  const context = ctx.$instance

  if (context) {
    const domEl = context.domEl as Node

    if (domEl) {
      ctx.$instance = patch(domEl as HTMLElement, context.instance, context)
    }
  }
}

class Component<P = {}, S = {}> implements TComponent<P, S> {

  constructor (props: P) {
    this.props = deepFreeze(props || {})
    this.state = deepFreeze(this.state || {})
  }

  props: {
    children?: TChildren
  } & P

  state: S | Object = deepFreeze({})

  $instance: TInstanceTree | null = null

  setState (newComponentState: (prevState: TState) => TState | TState) {
    const oldState = { ...(this.state as Object) }
    let newState: TState

    if (isFunction(newComponentState)) {
      newState = { ...newComponentState(oldState) }
    } else {
      newState = { ...newComponentState }
    }

    this.state = deepFreeze({
      ...oldState,
      ...newState
    })

    reRender(this)
  }

  render () {
    return null
  }

}

export default Component
