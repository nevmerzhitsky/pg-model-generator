const fs = require('fs')

module.exports = dumper

function dumper(jsonPath, type, creds, proxy = {}) {
  return dumpJson(type, creds, proxy).then(
    data => saveJson(jsonPath, data)
  )
}

function dumpJson(type, creds, proxy) {
  // @TODO Dump length of field
  return require(`./${type}.js`)(creds, proxy)
}

function saveJson(jsonPath, data) {
  fs.writeFileSync(jsonPath, JSON.stringify(data))
  console.log(`JSON dump saved to ${jsonPath}`)
}
