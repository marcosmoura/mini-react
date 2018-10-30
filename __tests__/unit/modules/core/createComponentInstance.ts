import createComponentInstance from '@/core/createComponentInstance'
import ComponentClass from 'test/fixtures/componentClass'

const props = {
  count: 10
}

function checkInstance (instance: TInstanceElement) {
  const expectedInstance = {
    $instance: null,
    props,
    state: {}
  }

  expect(instance).toEqual(expectedInstance)
  expect(instance.render).toBeDefined()
  expect(instance.setState).toBeDefined()
}

it('create instance for components', () => {
  const actualInstance = createComponentInstance(ComponentClass, props)

  checkInstance(actualInstance)
})

it('recreate instance for already created components', () => {
  const oldInstance = createComponentInstance(ComponentClass, props)
  const actualInstance = createComponentInstance(oldInstance, props)

  checkInstance(actualInstance)
})
