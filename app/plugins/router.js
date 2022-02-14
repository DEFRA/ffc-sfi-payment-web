const routes = [].concat(
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/static'),
  require('../routes/home'),
  require('../routes/payment-holds'),
  require('../routes/add-payment-hold'),
  require('../routes/remove-payment-hold'),
  require('../routes/payment-schemes'),
  require('../routes/update-payment-scheme')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
