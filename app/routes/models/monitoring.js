function ViewModel () {
  this.model = {
    searchByFrn: searchByFrn()
  }
}

const searchByFrn = () => {
  const searchModel = {
    id: 'frn-search-input',
    name: 'frn',
    label: {
      text: 'Search for payments by Firm Reference Number (FRN)',
      hint: 'For example, 1234567890',
      classes: 'govuk-!-font-weight-bold'
    },
    input: {
      classes: 'govuk-input--width-20'
    },
    button: {
      classes: 'search-button'
    },
    inputmode: 'numeric'
  }

  return searchModel
}

module.exports = ViewModel
