import createComponentInstance from '@/core/createComponentInstance'
import ComponentClass from 'test/fixtures/componentClass'

it('create instance for components', () => {
  const actualInstance = createComponentInstance(ComponentClass, {
    count: 10
  })
  const expectedInstance = {
    $instance: null,
    props: {
      count: 10
    },
    state: {}
  }

  expect(actualInstance).toEqual(expectedInstance)
  expect(actualInstance.render).toBeDefined()
  expect(actualInstance.setState).toBeDefined()
})

it('recreate instance for already created components', () => {
  const props = {
    count: 10
  }
  const oldInstance = createComponentInstance(ComponentClass, props)
  const actualInstance = createComponentInstance(oldInstance, props)
  const expectedInstance = {
    $instance: null,
    props: {
      count: 10
    },
    state: {}
  }

  expect(actualInstance).toEqual(expectedInstance)
  expect(actualInstance.render).toBeDefined()
  expect(actualInstance.setState).toBeDefined()
})
