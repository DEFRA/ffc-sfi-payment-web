const { getBlobList } = require('../storage')

module.exports = {
  method: 'GET',
  path: '/event-projection',
  options: {
    handler: async (request, h) => {
      await getBlobList()
      return h.view('storage-details', { })
    }
  }
}
