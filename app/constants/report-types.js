const getReportTypes = () => ({
  'Payment request statuses': 'payment-requests',
  'Combined transaction report': 'transaction-summary',
  'Suppressed payment requests': 'suppressed-payments',
  'AP-AR listing report': 'ap-ar-listing',
  Holds: 'holds',
  'Request Editor report': 'request-editor'
})

module.exports = {
  getReportTypes
}
