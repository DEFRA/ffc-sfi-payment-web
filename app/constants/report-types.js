const getReportTypes = () => ({
  'Payment request statuses': 'payment-requests',
  'Combined transaction report': 'transaction-summary',
  'Suppressed payment requests': 'suppressed-payments',
  'AP-AR Listing Report': 'ap-listing',
  Holds: 'holds'
})

module.exports = {
  getReportTypes
}
