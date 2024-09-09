const ViewModel = require('../../../../../app/routes/models/search')

describe('ViewModel', () => {
  test('should create a model with the correct label text and value', () => {
    const labelText = 'Search for user'
    const value = '123456'
    const viewModel = new ViewModel(labelText, value)

    expect(viewModel.model.label.text).toBe(labelText)
    expect(viewModel.model.value).toBe(value)
    expect(viewModel.model.input.classes).toBe('govuk-input--width-20')
    expect(viewModel.model.button.classes).toBe('search-button')
    expect(viewModel.model.inputmode).toBe('numeric')
  })

  test('should add error message when error is provided', () => {
    const labelText = 'Search for user'
    const value = '123456'
    const error = { message: 'Invalid input' }
    const viewModel = new ViewModel(labelText, value, error)

    expect(viewModel.model.errorMessage).toEqual({
      text: 'Invalid input'
    })
  })

  test('should not add error message when error is not provided', () => {
    const labelText = 'Search for user'
    const value = '123456'
    const viewModel = new ViewModel(labelText, value)

    expect(viewModel.model.errorMessage).toBeUndefined()
  })

  test('should create a model with the correct default classes', () => {
    const labelText = 'Search for user'
    const value = '123456'
    const viewModel = new ViewModel(labelText, value)

    expect(viewModel.model.label.classes).toBe('govuk-!-font-weight-bold')
    expect(viewModel.model.input.classes).toBe('govuk-input--width-20')
    expect(viewModel.model.button.classes).toBe('search-button')
  })
})
