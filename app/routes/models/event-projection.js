function ViewModel (frn, error) {
  this.model = {
    search: search(frn, error),
    frn
  }
}

const search = (value, error) => {
  const searchModel = {
    id: 'user-search',
    name: 'frn',
    label: {
      text: 'Search for events by FRN number',
      classes: 'govuk-!-font-weight-bold'
    },
    input: {
      classes: 'govuk-input--width-20'
    },
    button: {
      classes: 'search-button'
    },
    inputmode: 'numeric',
    value
  }

  if (error) {
    searchModel.errorMessage = {
      text: error.message
    }
  }

  return searchModel
}

module.exports = ViewModel
