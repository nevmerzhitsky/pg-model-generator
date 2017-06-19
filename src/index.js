"use strict"
const {join} = require('path')
const fs = require('fs')
const dumper = require('./dumper')
const parser = require('./metaParser')
const annotator = require('./annotator')

const connection = {
  host: 'admin.web.dev.velvica.com',
  port: 5432,
  username: '<username>',
  password: '<password>',
  database: 'rs4'
}
const dumpPath = join(__dirname, '..', 'dump.json')
const metaModelPath = join(__dirname, '..', 'meta1.json')

console.log('Start gathering info about schema(s)...')
Promise.resolve(true)
  .then(() => {
    return
    console.log('\tDump information_schema in the driver notation')
    dumper(dumpPath, 'pgsql', connection)
  })
  .then(() => {
    return
    //console.log('\t<init meta-mapper by static data for pg information_schema and user-config>')
    console.log('\tConvert the driver notation to universal meta notation')
    const meta1 = parser(require(dumpPath), 'pgsql')
    fs.writeFileSync(metaModelPath, JSON.stringify(meta1))
    console.log(`\tJSON meta #1 saved to ${metaModelPath}`)
  })
  .then(() => {
    console.log('\t<generate abstract models with annotations>')
    const meta2 = annotator(require(metaModelPath), )
  })
  .then(() => console.log('\t<run abstract-to-php converted>'))
  .then(() => console.log('finished!'))
