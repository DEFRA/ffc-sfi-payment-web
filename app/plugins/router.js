const routes = [].concat(
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/static'),
  require('../routes/home'),
  require('../routes/cookies'),
  require('../routes/payment-holds'),
  require('../routes/add-payment-hold'),
  require('../routes/remove-payment-hold')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
