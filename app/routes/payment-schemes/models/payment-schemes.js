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

const getAllRows = (values) => {
  const items = []

  for (const val of values) {
    val.active = val.active ? 'Active' : 'Not Active'
    items.push(val)
  }

  return items
}

module.exports = ViewModel
