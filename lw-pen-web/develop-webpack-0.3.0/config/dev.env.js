'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  lwAuthzServer: '"http://10.0.0.84:8084"',
  lwGardenServer: '"http://10.0.0.84:8083"',
  lwFileserver: '"http://10.0.0.10:96"',
  lwClassInteraction: '"http://10.0.0.6:8083"',
  lwtpkWeb: '"http://10.0.0.6:8081"'
})

// module.exports = merge(prodEnv, {
//   NODE_ENV: '"development"',
//   lwAuthzServer: '"http://tpktest.laiweitec.com:96"',
//   lwGardenServer: '"http://tpktest.laiweitec.com:96"',
//   lwFileserver: '"http://tpktest.laiweitec.com:96"',
//   lwClassInteraction: '"http://tpktest.laiweitec.com:96"',
//   lwtpkWeb: '"http://tpktest.laiweitec.com:62"'
// })