const Controllers = require('../controllers')
const utils = require('../utils')
const routers = (app) => {
  app.route('/api/article').get(Controllers.TEST.article)
  app.route('/api/weather').get(Controllers.TEST.weather)
  app.get('*', Controllers.SSR.application)
  app.use(utils.NotFind)
} 

module.exports = routers