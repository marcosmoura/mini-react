declare function node(nodeProps: TRawNode): TVNode

declare namespace MiniReact {
  function render<TComponent>(componentClass: TComponent, renderEl: HTMLElement): string
}

declare interface Component<P, S> extends TComponent<P, S> {}
