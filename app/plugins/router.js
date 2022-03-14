const routes = [].concat(
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/static'),
  require('../routes/home'),
  require('../routes/authenticate'),
  require('../routes/login'),
  require('../routes/logout'),
  require('../routes/holds'),
  require('../routes/schemes'),
  require('../routes/dev-auth')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
