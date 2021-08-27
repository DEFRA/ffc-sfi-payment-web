function ViewModel (value, error) {
  // Constructor function to create logic dependent nunjucks page
  this.model = {
    id: 'scheme',
    name: 'scheme',
    schemeId: `${value.schemeId}`,
    schemeName: `${value.name}`,
    active: `${value.active}`,
    fieldset: {
      legend: {
        text: `Do you want to update scheme ?`,
        isPageHeading: true,
        classes: 'govuk-fieldset__legend--l'
      }
    },
    items: [
      {
        value: true,
        text: 'Active',
        checked: value.active == 'true' ? true : false
      },
      {
        value: false,
        text: 'Not Active',
        checked: value.active == 'false' ? true : false
      }
    ]
  }

  // If error is passed to model then this error property is added to the model
  if (error) {
    this.model.errorMessage = {
      text: 'Please select if you would like to submit your application.'
    }
  }
}

module.exports = ViewModel
