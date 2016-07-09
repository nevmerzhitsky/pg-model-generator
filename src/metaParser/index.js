const {join} = require('path')

module.exports = metaparser

function metaparser(json, type) {
  const staticMap = initByStatic(type)
  let result = {}

  for (let table of Object.keys(json.tables)) {
    console.log('table', table)
    const tableData = json.tables[table]

    result[table] = {}

    for (let column of Object.keys(tableData.columns)) {
      const columnData = tableData.columns[column]
      const rec = result[table][column] = {}

      rec.dataType = columnData.data_type
      if (typeof staticMap.datatype.staticMatch[rec.dataType] !== 'undefined') {
        rec.dataType = staticMap.datatype.staticMatch[rec.dataType]
      }
    }
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