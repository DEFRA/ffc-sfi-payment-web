function ViewModel (values, error) {
  this.model = {
    caption: 'Payment Schemes',
    captionClasses: 'govuk-table__caption--m',
    firstCellIsHeader: true,
    head: getHeaders(),
    rows: getAllRows(values)
  }
}

const getHeaders = () => {
  return [
    {
      text: 'Scheme Id'
    },
    {
      text: 'Name'
    },
    {
      text: 'Active/Not Active'
    },
    {
      text: ''
    }
  ]
}

const getAllRows = values => {
  return values.map(val => {
    const copy = { ...val }
    copy.active = copy.active ? 'Active' : 'Not Active'
    return copy
  })
}

module.exports = ViewModel
