# Development Process

To create Mini React, I started planning some milestones, creating and improving the tests along the way. They were:


## API definition

First of all, I had to define the library API. By default, it should export the `Component` class and `node` function, to be used anywhere. They should also be bound to global window scope. So if we are using it using a Bundler (like Webpack, parcel) or inside an index.html as a `<script>` tag, it should work regardless. In that way, when importing the library, we can use it like that:


### Mounting Components

To mount the Root Component:

``` js
import MiniReact from 'mini-react'

MiniReact.render(new MyApp(), document.getElementById('#root'))
```

Or, in a cleaner way:

``` js
import { render }  from 'mini-react'

render(new MyApp(), document.getElementById('#root'))
```


### Creating Components

``` js
import MiniReact from 'mini-react'

class MyApp extends MiniReact.Component {

  constructor (props) {
    super(props)
    // ...
  }

  render () {
    return MiniReact.node({
      tagName: 'div',
      textContent: 'Hello, My App!'
    })
  }

}
```

Or, in a cleaner way:

``` js
import { Component, node }  from 'mini-react'

class MyApp extends Component {

  constructor (props) {
    super(props)
    // ...
  }

  render () {
    return node({
      tagName: 'div',
      textContent: 'Hello, My App!'
    })
  }

}
```


## Render function

On the first milestone, I wanted my `MiniReact.render()` function, to only render the App class, without being able to have props, state, sub-components, rerender, diff/patch process... What I really wanted was to read the contents from the `node({})` function and render it on the Web Browser.

## Creating the VNode structure

Although the `node({})` function already accept a very reasonable object structure, it was not the best way to create elements from that. So I started the conversion from that object to a more robust solution of VNode, commonly used by React, Vue, Inferno, Preact, and others. It was not based on any solution out there, so basically I created my own format. I also created 3 categories to describe my VNode types: `element`, `text` and `component`. With that, I could decide each step I would make to create a valid DOM Node

## Creating elements

With the VNode structure, I started to convert the VNode into real DOM elements, using `document.createElement()` for VNodes that have a `tagName` attribute and `document.createTextNode()` for text elements. At the very beginning, I was not considering the `componentClass` property, as this was moved to a future milestone. Each call on `node()` function returned a valid VNode. So, when calling the `MiniReact.render()`, I was interpreting the contents of the render function, converting it to a valid VNode and then creating the actual element and repeating the process for its children nodes, appending them to the closest parent. With the whole element and it's children created, I just replaced the dom element with the new element structure, and voilá, the rendering process was done. It was a pretty straightforward process.

## Naive rerender

After creating the DOM elements, I wanted to change the DOM using a rerender process. My first attempt was to call the `MiniReact.render()` again, passing a new component instance and the last created DOM element. It was an easy and no performatic solution, that helped me to test all possible VNode and element creation. With that in mind, I created a bunch of Unit tests to cover those scenarios.

## Subcomponents

As I was ignoring the subcomponents, I wanted to render them with the aforementioned process. I could do that easily by separating the creation of elements, in 3 different functions that would filter the 3 types of VNode. So, instead of just passing the VNode to the `createElement` internal function, I had to create the component instance, call the render function an then pass it's content forward to create the DOM elements. This was easy and, to be polite, naive!

## setState + props

I was not thinking right when I was creating the whole set of elements. I forgot that, for every single component, I have an instance, that should keep updated whenever something changes with setState or when receiving new props. But I had only the DOM elements. :(. So I had to think in another direction and then I started to refactor my main code. I thought about a binary tree to save the instances. But, you know, it shouldn't be that complicated! So I created a very basic instance tree solution.

For every DOM element that I was creating, it should have an instance that represents its state. So I ended up with a very simple solution. My tree has the following structure:

```
{
  domEl: A reference to the actual dom element mounted
  vNode: The old mounted VNode that would be used later to create the diff/patch
  childInstances: An array of instances for the child elements, with the same structure as this
  instance: If the VNode represents a component, I saved here its instance when calling "new Component". If not, the value is null
}
```

An example of this structure would be something like that:
``` typescript
{
  domEl: HTMLElement,
  vNode: {
    tagName: 'div',
    domProps: {
      class: 'my-app'
    },
    children: [
      {
        component: AppTitle,
        props: {}
      }
    ]
  },
  instance: null, // It's not a component
  childInstances: [
    {
      domEl: HTMLElement,
      vNode: {
        tagName: 'h1',
        textContent: 'Hello, My App!',
        children: []
      },
      instance: {
        // component instance
      },
      childInstances: []
    }
  ]
}
```

If that in mind, I could think on a way to call the setState function, creating a rerender process. With that, I could reuse the `MiniReact.render()`, but instead of passing the root element, I could pass the internal component instance and it's DOM Element. So, the rerender would be focused on each component. If an upper component does the same process, I would then recreate the instance tree, with new update information about the rendered DOM Elements. Cool, uh?


## Diff/Patch

At this point, I could say that my initial job was done. I could even call that as my last milestone, but I thought it wasn't good enough. Any good library that use instances to represent a Virtual DOM, do not recreate all the elements all over again. That is insane and hurts performance. And it can make the process to expand the library features way worse. So I started to refactor my library again, to patch the existent DOM elements, reusing the instances and it's already appended DOM Elements. The process was really difficult because we have several cases:

- *A DOM element will be mounted for the first time*: In this case, I have to create its instance and append it to DOM. This is the case of the Root Component. But, let's supposed that, for some reason, an internal component now has a completely new VNode from render function (based on a condition or something like that). In this case, the new element won't have a created instance/element.

- *A DOM element should be removed from DOM*: When an element should be removed from DOM, we have to remove them from the rendered elements and also update the instance tree, to remove the element

- *A DOM element changed, with new props*: This is the most common case when some text or HTML Attribute changes. In this case, the instance and the element are already there and we should update its instance and update the attributes (or add/remove ones).

- *A Component returns a null value from the render function*: This is that scenario when, for some reason, a component return null. This is the case when we want to remove the element from the DOM, but we should keep it's instance alive and well, so when the render function returns a valid VNode, we will mount the element AT THE SAME POSITION than before. This is a crazy scenario to implement.

- *A component returns another component as the main VNode*: This is the worse scenario ever. Because the VNode point to another component that will become a whole different VNode. Both instances should be alive.

- *The component VNode add/remove/change it's children*: In this case we have to loop through the children to patch the children in place, adding new, removing old and updating the ones that changed. This part it's not performatic, because should use a "key" to keep track of each element, so we wouldn't need to loop on each child to do the job.

- *Other edge cases*: There is a bunch of edge cases, when a child, at the same position, becomes a component instead of an element. Or when, at the same position, a child VNode that was an element becomes a text...


## Wrapping up and refactoring

After that, my code was not that simple to understand and maintain. So I did a full refactor, renaming functions, moving code, and stuff. The was the part when the Unit tests shine bright like a diamond! I was refactoring while watching the tests breaking. So I could fix them right away.


## Example Application and E2E tests

When everything was in place, I started to create the Example App. I recreated the Component structure, using a new `node` to represent the HTML elements that I wanted to be there. When I finished, everything was working. But I forgot to tests in other browsers. That's why I started creating some E2E tests. With that, I could test between different web browsers, changing the code and watching the tests again. Although the tests were waaaay simple, I could prevent some rendering errors.

:D
