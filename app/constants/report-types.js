const getReportTypes = () => ({
  'Payment request statuses': 'payment-requests',
  'Combined transaction report': 'transaction-summary',
  'Suppressed payment requests': 'suppressed-payments',
  'AP Listing Report': 'ap-listing',
  'AR Listing Report': 'ar-listing',
  Holds: 'holds'
})

module.exports = {
  getReportTypes
}
