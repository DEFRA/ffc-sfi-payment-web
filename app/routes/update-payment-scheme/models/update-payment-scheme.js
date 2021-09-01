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
        text: getText(value.active),
        isPageHeading: true,
        classes: 'govuk-fieldset__legend--l'
      }
    },
    items: [
      {
        value: true,
        text: 'Yes'
      },
      {
        value: false,
        text: 'No'
      }
    ]
  }

  // If error is passed to model then this error property is added to the model
  if (error) {
    this.model.errorMessage = {
      text: 'Please select yes or no to update.'
    }
  }
}

const getText = (active) => {
  if (active === 'true') {
    return 'Would you like to set the payment scheme to Not Active ?'
  } else {
    return 'Would you like to set the payment scheme to Active ?'
  }
}

module.exports = ViewModel
