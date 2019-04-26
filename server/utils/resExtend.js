'use strict'
const lodash = require('lodash')
module.exports = (req, res, next) => {
  const extendAttr = {
    sendOk: (data) => {
      const rst = {
        status: 200,
        errorCode: 0,
        data: data
      }
      return res.send(lodash.extend(rst))
    },
    sendErr: (err) => {
      return res.send(lodash.extend(err))
    },
    sendViews: (err) => {
      if (err.url) {
          res.redirect(err.url)
      } else if (err.code === 404) {
          return res.status(404).send('404')
      } else {
          return res.status(500).send('500')
      }
    }
  }
  lodash.extend(res, extendAttr)
  next()
}
