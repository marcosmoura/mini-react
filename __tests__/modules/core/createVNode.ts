import createVNode from '@/core/createVNode'

import ComponentClass from 'test/fixtures/componentClass'
import emptyEvent from 'test/fixtures/emptyEvent'
import vNodeWithTagName from 'test/fixtures/vNodeWithTagName'
import vNodeWithTagNameAndChildren from 'test/fixtures/vNodeWithTagNameAndChildren'
import vNodeWithComponentClass from 'test/fixtures/vNodeWithComponentClass'
import vNodeWithTextContent from 'test/fixtures/vNodeWithTextContent'
import vNodeWithTagNameAndTextContent from 'test/fixtures/vNodeWithTagNameAndTextContent'
import vNodeWithProps from 'test/fixtures/vNodeWithProps'
import vNodeWithDomProps from 'test/fixtures/vNodeWithDomProps'

afterEach(() => jest.restoreAllMocks())

describe('Valid node values', () => {
  it('create a VNode with tagName', () => {
    const actualNode = createVNode({
      tagName: 'div'
    })

    expect(actualNode).toEqual(vNodeWithTagName)
  })

  it('create a VNode with tagName and children', () => {
    const actualNode = createVNode({
      tagName: 'div',
      children: [
        createVNode({
          tagName: 'div'
        })
      ]
    })

    expect(actualNode).toEqual(vNodeWithTagNameAndChildren)
  })

  it('create a VNode with textContent', () => {
    const actualNode = createVNode({
      textContent: 'Test'
    })

    expect(actualNode).toEqual(vNodeWithTextContent)
  })

  it('create a VNode with tagName and textContent', () => {
    const actualNode = createVNode({
      tagName: 'div',
      textContent: 'Test'
    })

    expect(actualNode).toEqual(vNodeWithTagNameAndTextContent)
  })

  it('create a VNode with componentClass', () => {
    const actualNode = createVNode({
      componentClass: ComponentClass
    })

    expect(actualNode).toEqual(vNodeWithComponentClass)
  })

  it('ignore tagName when creating a VNode with componentClass', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation((warn: string) => warn)
    const actualNode = createVNode({
      tagName: 'div',
      componentClass: ComponentClass
    })
    const expectedNode = vNodeWithComponentClass

    expect(actualNode).toEqual(expectedNode)
    expect(consoleSpy).toReturnWith('When tagName and componentClass are provided, the tagName will be ignored')
  })

  it('create VNode with props', () => {
    const actualNode = createVNode({
      componentClass: ComponentClass,
      props: {
        count: 10
      }
    })

    expect(actualNode).toEqual(vNodeWithProps)
  })

  it('warn when props are passed without componentClass', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation((warn: string) => warn)
    const actualNode = createVNode({
      tagName: 'div',
      props: {
        count: 10
      }
    })
    const expectedNode = {
      type: 'element',
      tagName: 'div',
      props: {
        count: 10
      },
      domProps: {},
      children: []
    }

    expect(actualNode).toEqual(expectedNode)
    expect(consoleSpy).toReturnWith('The props attribute only works with componentClass')
  })

  it('create VNode with domProps', () => {
    const actualNode = createVNode({
      tagName: 'div',
      class: 'my-element-class',
      onchange: emptyEvent
    })

    expect(actualNode).toEqual(vNodeWithDomProps)
  })
})

describe('Error Validation', () => {
  let consoleSpy: any

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation((error: string) => error)
  })

  it('throw an error on incomplete node', () => {
    const node = () => {
      createVNode({
        props: {}
      })
    }

    expect(node).toThrow('Invalid Node')
    expect(consoleSpy).toReturnWith('The node is missing a component or a valid tagName')
  })

  it('throw an error when componentClass is not a valid Class', () => {
    const node = () => {
      createVNode({
        componentClass: 'MyComponentAsString'
      })
    }

    expect(node).toThrow('Invalid Node')
    expect(consoleSpy).toReturnWith('The componentClass is not a valid class Component')
  })

  it('throw an error when children is not an Array', () => {
    const node = () => {
      createVNode({
        tagName: 'div',
        children: {}
      })
    }

    expect(node).toThrow('Invalid Node')
    expect(consoleSpy).toReturnWith('The children is not a valid Array')
  })

  it('throw an error when props is not an Object', () => {
    const node = () => {
      createVNode({
        tagName: 'div',
        props: []
      })
    }

    expect(node).toThrow('Invalid Node')
    expect(consoleSpy).toReturnWith('The props is not a valid Object')
  })

  it('throw an error when event is not a Function', () => {
    const node = () => {
      createVNode({
        tagName: 'div',
        onchange: 'myOnChangeFn'
      })
    }

    expect(node).toThrow('Invalid Node')
    expect(consoleSpy).toReturnWith('The "onchange" event is not a valid Function')
  })
})
