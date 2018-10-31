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
[x] Create immutable props
[x] Add validations on each step
  [x] Add validation to vnode creation
  [x] Add validation to render function
  [x] Add validation to createElement function

[x] e2e tests - **Optional**
  [x] Setup Testcafe
  [x] Create application e2e

[x] Unit Tests
  [x] modules
    [x] core
      [x] component
      [x] createComponentInstance
      [x] createVNode
    [x] dom
      [x] patchDom
      [x] createElement
      [x] createInstance
      [x] render

[x] Create application layout
  [x] Refactor code to improve separation of concerns
[x] Create application validations
[x] Create better build tools
[x] Create documentation
  [x] Included features
  [x] Disclaimer about SVG
  [x] Build process
  [x] Code Structure
  [x] Separation of concerns
  [x] Development process
  [x] Steps to achieve all the included features
    [x] API definition
      [x] Mounting Components
      [x] Creating Components
    [x] Render function
    [x] Creating the VNode structure
    [x] Creating elements
    [x] Naive rerender
    [x] Subcomponents
    [x] setState + props
    [x] Diff/Patch
    [x] Wrapping up and refactoring
    [x] Example Application and E2E tests

[x] Refactor code to better match the scope and improve separation of concerns
[x] Revisit unit tests to cover all missing scenarios after refactor