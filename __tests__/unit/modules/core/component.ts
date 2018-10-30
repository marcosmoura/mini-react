import Component from '@/core/component'
import ComponentClass from 'test/fixtures/componentClass'
import vNodeWithTagName from 'test/fixtures/vNodeWithTagName'

it('create instance for a component', () => {
  const componentInstance = new ComponentClass()
  const expectedInstance = {
    $instance: null,
    props: {},
    state: {}
  }

  expect(componentInstance).toEqual(expectedInstance)
  expect(componentInstance.render).toBeTruthy()
  expect(componentInstance.setState).toBeTruthy()
})

it('setState change component state', () => {
  const componentInstance = new ComponentClass()
  const newState = {
    test: 'test'
  }

  expect(componentInstance.state).toEqual({})
  componentInstance.setState(newState)
  expect(componentInstance.state).toEqual(newState)
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
