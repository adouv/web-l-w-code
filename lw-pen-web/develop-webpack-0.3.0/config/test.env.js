'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  lwAuthzServer: '"http://10.0.0.84:8084"',
  lwGardenServer: '"http://10.0.0.84:8083"',
  lwFileserver: '"http://10.0.0.10:96"',
  lwClassInteraction: '"http://10.0.0.6:8083"',
  lwtpkWeb: '"http://10.0.0.6:8081"'
})
