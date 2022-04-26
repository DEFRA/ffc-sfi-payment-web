const padTo2Digits = (num) => {
  return num.toString().padStart(2, '0')
}

const parseJsonDate = (jsonDate, style = true) => {
  const date = new Date(jsonDate)
  const formatDate = `${padTo2Digits(date.getDate())}/${padTo2Digits(date.getMonth() + 1)}/${date.getFullYear()} ${padTo2Digits(date.getHours())}:${padTo2Digits(date.getMinutes())}:${padTo2Digits(date.getSeconds())}`
  return style ? `<br /><div style='font-size:12px'>${formatDate}</div>` : formatDate
}

module.exports = parseJsonDate
