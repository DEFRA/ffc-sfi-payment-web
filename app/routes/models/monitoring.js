function ViewModel () {
  this.model = {
    searchByFrn: searchByFrn(),
    searchByBatch: searchByBatch()
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

const searchByBatch = () => {
  const searchModel = {
    id: 'batch-search-input',
    name: 'batch',
    label: {
      text: 'Search for payments by batch name',
      hint: 'For example, SITISFI_0001_AP_2022110909115624.dat',
      classes: 'govuk-!-font-weight-bold'
    },
    input: {
      classes: 'govuk-input--width-20'
    },
    button: {
      classes: 'search-button'
    },
    inputmode: 'text'
  }

  return searchModel
}

module.exports = ViewModel
