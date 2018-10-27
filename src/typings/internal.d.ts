type TElement = Element | SVGAElement | ShadowRoot | DocumentFragment | HTMLElement | Node | Comment | string | number | null
type TText = string | number
type TChildren = Array<TVNode | TText>

type TProps = {
  children?: TChildren
} & Object

type TState = Object

interface TRawNode {
  children?: TChildren,
  tagName: string,
  textContent: TText,
  componentClass<P, S>(): TComponent<P, S>,
  props: Object
}

interface TInstance {
  instance?: any,
  componentInstance?: any,
  domEl: TElement,
  vNode: TVNode,
  childInstances: Array<TInstance>
}

interface TVNode {
  type: string,
  domProps: Object,
  props: TProps,
  tagName?: string,
  textContent?: TText,
  component?<P, S>(): TComponent<P, S>,
  children?: TChildren
}

declare interface TComponent<P, S> {
  state: S | null
  props: {
    children?: TChildren
  } & P

  $instance: TInstance | null

  setState(newState: () => S): void

  render(nextProps: P, nextState: S): TElement
}

interface DynamicClass<TClass> {
  new(): TClass
}
