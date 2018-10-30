import Component from '@/core/component'
import ComponentClass from 'test/fixtures/componentClass'
import vNodeWithTagName from 'test/fixtures/vNodeWithTagName'

function checkSingleInstance (instance: TInstanceElement, expectedInstance: TInstanceElement) {
  expect(instance).toEqual(expectedInstance)
  expect(instance.render).toBeTruthy()
  expect(instance.setState).toBeTruthy()
}

it('create instance for a component', () => {
  const componentInstance = new ComponentClass()
  const expectedInstance = {
    $instance: null,
    props: {},
    state: {}
  }

  checkSingleInstance(componentInstance, expectedInstance)
})

it('create instance for a renderless component', () => {
  class RenderlessComponent extends Component {}

  const componentInstance = new RenderlessComponent()
  const expectedInstance = {
    $instance: null,
    props: {},
    state: {}
  }

  checkSingleInstance(componentInstance, expectedInstance)
  expect(componentInstance.render()).toBe(null)
})

it('setState change component state based on an Object', () => {
  const componentInstance = new ComponentClass()
  const newState = {
    test: 'test'
  }

  expect(componentInstance.state).toEqual({})
  componentInstance.setState(newState) // passing object directly
  expect(componentInstance.state).toEqual(newState)
})

it('setState change component state based on a Function', () => {
  const componentInstance = new class ComponentWithInitialState extends Component {
    state = {
      test: 'test'
    }

    render () {
      return vNodeWithTagName
    }
  }

  expect(componentInstance.state).toEqual({ test: 'test' })
  componentInstance.setState((oldState: any) => ({
    test: oldState.test + ' 1'
  })) // passing function to evaluate receiving oldState
  expect(componentInstance.state).toEqual({
    test: 'test 1'
  })
})

it('props are immutable', () => {
  const props = { count: 1 }
  const componentInstance = new ComponentClass(props)
  const mutateProp = () => (componentInstance.props.count = 2)

  expect(componentInstance.props).toEqual(props)
  expect(mutateProp).toThrow()
})

it('state values are immutable', () => {
  class ComponentWithState extends Component {
    state = {
      count: 1
    }

    render () {
      return vNodeWithTagName
    }
  }

  const componentInstance = new ComponentWithState()
  const lastState = componentInstance.state

  expect(componentInstance.state).toEqual({
    count: 1
  })
  componentInstance.setState({ count: 1 })
  expect(componentInstance.state).not.toBe(lastState)
})
