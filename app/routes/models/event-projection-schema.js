module.exports = [{
  eventType: 'siti-inbound',
  service: 'siti inbound',
  externalProcess: true,
  eventLinks: [
    {
      link: 'batch-processing'
    }
  ]
},
{
  eventType: 'dax-inbound',
  service: 'dax inbound',
  externalProcess: true,
  eventLinks: [
    {
      link: 'payment-request-return'
    }
  ]
},
{
  eventType: 'dax-outbound',
  externalProcess: true,
  service: 'dax outbound',
  eventLinks: []
},
{
  eventType: 'batch-processing',
  service: 'ffc-pay-batch-processor',
  eventLinks: [
    {
      link: 'payment-request-enrichment'
    }
  ]
},
{
  eventType: 'payment-request-enrichment',
  service: 'ffc-pay-enrichment',
  eventLinks: [
    {
      link: 'payment-request-processing'
    }
  ]
},
{
  eventType: 'payment-request-processing',
  service: 'ffc-pay-processing',
  eventLinks: [
    {
      link: 'payment-request-submission'
    },
    {
      link: 'payment-request-debt-response'
    },
    {
      link: 'payment-request-manual-ledger-response'
    }
  ]
},
{
  eventType: 'payment-request-submission',
  service: 'ffc-pay-submission',
  eventLinks: [
    {
      link: 'dax-outbound'
    }
  ]
},
{
  eventType: 'payment-request-debt-response',
  service: 'debt-enrichment',
  eventLinks: [
    {
      link: 'request-editor'
    }
  ]
},
{
  eventType: 'payment-request-manual-ledger-response',
  service: 'manual-ledger-check',
  eventLinks: [
    {
      link: 'request-editor'
    }
  ]
},
{
  eventType: 'request-editor',
  service: 'ffc-pay-request-editor',
  eventLinks: [
    {
      link: 'payment-request-ledger-assignment-quality-checked'
    }
  ]
},
{
  eventType: 'payment-request-ledger-assignment-quality-checked',
  service: 'quality-check',
  eventLinks: [
    {
      link: 'payment-request-processing'
    }
  ]
},
{
  eventType: 'payment-request-return',
  service: 'ffc-pay-responses',
  eventLinks: [
    {
      link: 'payment-request-processing'
    }
  ]
}]
