const {join} = require('path')

module.exports = metaparser

function metaparser(json, type) {
  const staticMap = initByStatic(type)
  let result = {}

  for (let table of Object.keys(json.tables)) {
    //console.log('table', table)
    const tableData = json.tables[table]

    result[table] = {}

    for (let column of Object.keys(tableData.columns)) {
      const columnData = tableData.columns[column]
      let rec = result[table][column] = {
        dataType: null,
        udtName: null,
        notNull: false,
        "default": null
      }

      fillFields(rec, staticMap.fieldsMap, columnData)

      //rec.dataType = columnData.data_type
      if (typeof staticMap.dataType.staticMatch[rec.dataType] !== 'undefined') {
        rec.dataType = staticMap.dataType.staticMatch[rec.dataType]
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

function fillFields(rec, fieldsMap, columnData) {
  for (let field of Object.keys(fieldsMap)) {
    const driverField = fieldsMap[field]
    // @TODO Parse !! at start of name?
    const inversion = (driverField.charAt(0) === '!')
    const driverClearField = !inversion ? driverField : driverField.substr(1)

    rec[field] = columnData[driverClearField]
    if (inversion) {
      rec[field] = !Boolean(rec[field])
    }
  }
}
