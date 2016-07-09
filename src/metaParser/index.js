const {join} = require('path')

module.exports = metaparser

function metaparser(json, type) {
  const staticMap = initByStatic(type)
  let result = {}

  for (let table of Object.keys(json.tables)) {
    console.log('table', table)
  }

  return result
}

function initByStatic(mapType) {
  return require(join(
    __dirname,
    'map',
    `${mapType}.json`
  ))
}

function initByUserDefined() {
  
}

function createMapper(staticMap) {
  let result = {
    
  }

  return result
}