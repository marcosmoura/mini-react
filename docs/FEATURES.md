# Features

## What is included

- Components: A single component should extend the `Component` class, that will have internal methods like `setState` and `render`
- Render components based on a Virtual DOM Node
- Props: Pass properties to sub components, in a One Way binding
- State: Store a per-component instance state that can be used as it's data
- Rerender: After triggering setState the component will evaluate the contents of the Render function again and render it to the actual DOM
- Diff/patch: Just like React, Vue or any other library that takes the approach of using a virtual DOM, Mini React reuses old component instances and old DOM nodes to improve performance and keep the DOM synced with the latest component changes. If a subcomponent changes, only that component (along with it's children) will rerender, receiving new props if applied and evaluating it's instance again. It is a very good approach to achieve better performance, better RAM/CPU usage and to make the usage of external tools easier.


## What wasn't implemented

The library do not implement some of the main features of React, like:
- Render SVG elements (It simply won't work)
- Virtual Nodes as functions (Like React Render Props)
- Composability (Like React's High Order Components)
- Props with support to Prop Types


# What isn't includes

- Lifecycles other than class constructor and render (like componentWillUnmount, componentDidMount...)
- Support to JSX
- Context API
- Rerender based on Keys (to boost performance)
- Fragments
- Error Boundaries
- Support to Web Components
- Any other stuff that wasn't mentioned in the first section :)
