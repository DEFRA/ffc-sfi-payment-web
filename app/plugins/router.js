const routes = [].concat(
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/static'),
  require('../routes/home'),
  // require('../routes/payment-holds'),
  // require('../routes/add-payment-hold'),
  // require('../routes/remove-payment-hold'),
  // require('../routes/payment-schemes'),
  // require('../routes/update-payment-scheme'),
  require('../routes/payment-monitor'),
  require('../routes/storage-details'),
  require('../routes/service-bus-details'),
  require('../routes/authenticate'),
  require('../routes/login'),
  require('../routes/logout'),
  require('../routes/holds'),
  require('../routes/schemes'),
  require('../routes/event-projection'),
  require('../routes/event-projection-detail'),
  require('../routes/payment-requests'),
  require('../routes/report'),
  require('../routes/dev-auth')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, _options) => {
      server.route(routes)
    }
  }
}
