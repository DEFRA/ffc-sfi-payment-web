const ViewModel = require('../../../../../app/routes/models/update-scheme')

const getText = (name, active) => {
  if (active) {
    return `Would you like to disable ${name}?`
  }
  return `Would you like to enable ${name}?`
}

test('ViewModel should add error message when error is true', () => {
  const value = { schemeId: '1', name: 'Test', active: true }
  const error = true

  const viewModel = new ViewModel(value, error)

  expect(viewModel.model.errorMessage).toEqual({
    text: 'Please select yes or no to update.'
  })
})

test('ViewModel should not add error message when error is false', () => {
  const value = { schemeId: '1', name: 'Test', active: true }
  const error = false

  const viewModel = new ViewModel(value, error)

  expect(viewModel.model.errorMessage).toBeUndefined()
})

test('getText should return disable message when active is true', () => {
  const name = 'Test'
  const active = true

  const text = getText(name, active)

  expect(text).toEqual('Would you like to disable Test?')
})

test('getText should return enable message when active is false', () => {
  const name = 'Test'
  const active = false

  const text = getText(name, active)

  expect(text).toEqual('Would you like to enable Test?')
})
