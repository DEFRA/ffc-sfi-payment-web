const getReportTypes = () => ({
  'Payment request statuses': 'payment-requests',
  'Combined transaction report': 'transaction-summary',
  'Suppressed payment requests': 'suppressed-payments',
  'AP-AR Listing Report': 'ap-ar-listing',
  Holds: 'holds'
})

module.exports = {
  getReportTypes
}
