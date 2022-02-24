module.exports = {
  method: 'GET',
  path: '/',
  options: {
    handler: async (request, h) => {
      return h.view('home', {
        totalHolds: 0,
        totalSchemes: 0
      })
    }
  }
}
