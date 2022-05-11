const projectionSchema = require('./event-projection-schema')
const parseJsonDate = require('../../parse-json-date')

function ViewModel (projection, frn) {
  this.model = {
    projection,
    graphDefinition: buildGraphDefinition(projection),
    frn
  }
}

const buildGraphDefinition = (projection) => {
  const graphDefinition = []
  if (projection?.events) {
    graphDefinition.push('graph TD \n')
    for (const schema of projectionSchema) {
      const eventRaised = projection.events.find(x => x.eventType === schema.eventType)
      graphDefinition.push(`${schema.eventType}[<strong>${schema.service}</strong>${eventRaised ? parseJsonDate(eventRaised.eventRaised) : ''}];`)
      for (const link of schema.eventLinks) {
        graphDefinition.push(`${schema.eventType} --> ${link.link};`)
      }

      schema.externalProcess && graphDefinition.push(`style ${schema.eventType} fill:#90cbf9, stroke:#001833, stroke-width:2px;`)

      if (eventRaised) {
        graphDefinition.push(`style ${schema.eventType} fill:#3CB043, stroke:#234F1E, stroke-width:2px;`)
        graphDefinition.push(`click ${schema.eventType} "/event-projection-detail/${projection.frn}/${projection.agreementNumber}/${projection.paymentRequestNumber}?eventType=${schema.eventType}";`)
      }
    }
  }
  return graphDefinition.join('')
}

module.exports = ViewModel
