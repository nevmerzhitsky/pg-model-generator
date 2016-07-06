//const {asyncPipe} = require('../ramda-promise.js')
const fs = require('fs')

module.exports = dumper

function dumper(jsonPath, type, creds, proxy = {}) {
  factory(type, creds, proxy).then(
    (data) => handler(jsonPath, data)
  )
}

function factory(type, creds, proxy) {
  return require('./pgsql.js')(creds, proxy)
}

function handler(jsonPath, data) {
  fs.writeFileSync(jsonPath, JSON.stringify(data))
}
