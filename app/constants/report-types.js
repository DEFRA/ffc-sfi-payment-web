module.exports.getReportTypes = () => {
    return {
        'Payment request statuses': 'payment-requests',
        'Combined transaction report': 'transaction-summary',
        'Suppressed payment requests': 'suppressed-payments',
        'AP Listing Report': 'ap-listing'
    }
}