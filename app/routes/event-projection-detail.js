const { getProjection, getBlobList } = require('../storage')
const ViewModel = require('./models/event-projection-detail')

module.exports = [{
  method: 'GET',
  path: '/event-projection-detail/{frn}/{agreementNumber}/{requestNumber}',
  options: {
    handler: async (request, h) => {
      const frn = request.params.frn
      const agreementNumber = request.params.agreementNumber
      const requestNumber = request.params.requestNumber
      const eventType = request.query.eventType

      if (frn && agreementNumber && requestNumber) {
        const blobData = await getBlobList(`${frn}/${agreementNumber}/${requestNumber}`)
        let projectionData = {}
        let eventDetails = {}

        if (blobData.blobList.length) {
          projectionData = await getProjection(`${blobData.blobList[0].blob}`)
          eventDetails = eventType ? projectionData.events.find(x => x.eventType === eventType) : projectionData.events.find(x => x.eventType === 'batch-processing')
          if (!eventDetails) {
            return h.redirect('/404')
          }
        } else {
          return h.redirect('/404')
        }

        return h.view('event-projection-detail', { eventDetails, ...new ViewModel(projectionData, frn) })
      }

      return h.redirect('/404').code(404).takeover()
    }
  }
}]
