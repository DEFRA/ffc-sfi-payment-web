const moment = require('moment')

const formatDate = (dateToFormat, currentDateFormat = 'YYYY-MM-DD') => {
  if (dateToFormat) {
    return moment(dateToFormat, currentDateFormat).format('DD/MM/YYYY')
  }
  return 'Unknown'
}

module.exports = formatDate
