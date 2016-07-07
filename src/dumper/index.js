//const {asyncPipe} = require('../ramda-promise.js')
const {nfcall} = require('q')
const fs = require('fs')

module.exports = dumper

function dumper(jsonPath, type, creds, proxy = {}) {
  return dumpJson(type, creds, proxy).then(
    data => saveJson(jsonPath, data)
  )
}

function dumpJson(type, creds, proxy) {
  return require('./pgsql.js')(creds, proxy)
}

function saveJson(jsonPath, data) {
  return nfcall(fs.writeFile, jsonPath, JSON.stringify(data))
    .then(console.log(`JSON dump saved to ${jsonPath}`))
}
