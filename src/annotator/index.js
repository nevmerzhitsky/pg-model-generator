const {join} = require('path')

module.exports = annotator

function annotator(metaJson, annRulesPath) {
  const rules = require(annRulesPath)
  let result = {}

  console.log('rules', rules);

  return result
}
