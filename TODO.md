[x] Create vnode definition
[x] Create vnode parse
[x] Create element based on vnode
[x] Create vnode tree
[x] Create component instance tree
[x] Create Component class that will be extended on each component
[x] Create setState function that will change the component state
[x] Create logic and idea on how to keep state/props on each render
[x] Create "naive" rerender function that will render the entire tree again replacing the actual dom nodes
[x] Attempt to create a "patch" cycle updating the dom nodes instead of recreating the entire structure again
[x] Attempt to create a more robust diff process to patch dom based on vnode
[x] Create immutable state
[ ] Create immutable props
[ ] Add validations on each step
  [x] Add validation to vnode creation
  [x] Add validation to render function
  [x] Add validation to createElement function
  [ ] Add validation to setState
  [ ] Add validation to props

[ ] e2e tests - **Optional**
  [ ] Setup Nightwatch
  [ ] Create application e2e

[ ] Unit Tests
  [ ] modules
    [ ] core
      [ ] component
      [x] createComponentInstance
      [x] createVNode
    [ ] dom
      [x] patchDom
      [x] createElement
      [x] createInstance
      [ ] render

  [ ] features
    [ ] diff/patch
    [ ] dom elements don't change after patch
    [ ] constructor
    [ ] props
    [ ] rerender
    [ ] setState
    [ ] setState + props
    [ ] dom events + setState

[x] Create application layout
  [ ] Refactor code to improve separation of concerns
[x] Create application validations
[ ] Create better build tools
[ ] Create documentation
  [ ] Included features
  [ ] Disclaimer about SVG
  [ ] Build process
  [ ] Code Structure
  [ ] Separation of concerns
  [ ] Development process
  [ ] Steps to achieve all the included features
    [ ] Unit tests
    [ ] Render function
    [ ] Naive rerender
    [ ] Sub components
    [ ] setState + props
    [ ] Attempt to diff/patch
    [ ] Wrapping up
    [ ] e2e tests
  [ ] Comparison between React, Mini React and Others

[ ] Refactor code to better match the scope and improve separation of concerns
[ ] Revisit unit tests to cover all missing scenarios after refactor
