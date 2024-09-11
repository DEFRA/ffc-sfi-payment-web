const readableStreamReturn = async (response, h, reportName) => {
  return h.response(response.readableStreamBody)
    .type('text/csv')
    .header('Connection', 'keep-alive')
    .header('Cache-Control', 'no-cache')
    .header('Content-Disposition', `attachment;filename=${reportName}`)
}

module.exports = {
  readableStreamReturn
}
