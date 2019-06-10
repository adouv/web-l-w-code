'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"https://easy-mock.com/mock/5950a2419adc231f356a6636/vue-admin"',
  lwAuthzServer: '"http://10.0.0.84:8084"',
  lwGardenServer: '"http://10.0.0.84:8083"',
  lwFileserver: '"http://10.0.0.10:96"',
  lwClassInteraction: '"http://10.0.0.6:8083"',
  lwtpkWeb: '"http://10.0.0.6:8081"',
  czGarden: '"http://10.0.0.149:8883"',
  czTpk: '"http://10.0.0.149:8090"',
})
