const moment = require('moment')

const formatDate = (dateToFormat, currentDateFormat = 'DD/MM/YYYY HH:mm') => {
  if (dateToFormat) {
    return moment(dateToFormat, currentDateFormat).format('DD/MM/YYYY')
  }
  return 'Unknown'
}

module.exports = formatDate
