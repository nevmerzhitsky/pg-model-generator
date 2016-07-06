const pg = require('pg')
const Client = pg.Client
const Promise = require('bluebird')
const _ = require('lodash')
const sql = require('./sql/pg')
const {omit} = require('ramda')

module.exports = dumper

function dumper(creds, proxy) {
  return toJSON(mapConfig(creds), 'public')
    .then(function (schemas) {
      return schemas
    })
    .catch(function (error) {
      throw Error(error)
    })
}

function mapConfig(creds) {
  // @TODO Use ramda for easy mapping
  return {
    user: creds.username,
    password: creds.password,
    host: creds.host,
    port: creds.port,
    database: creds.database
  }
}

function toJSON(connection, schema) {
  const client = new Client(connection)
  client.connect()

  const queries = [
    client.query(sql.getColumns, [schema]),
    client.query(sql.getTables, [schema]),
    client.query(sql.getConstraints, [schema])
  ]

  return Promise.all(queries)
    .spread(function (columns, tables, constraints) {
      const columnGroups = _.groupBy(columns.rows, 'table_name')

      return {
        // Group both by 'table_schema'
        tables: _.transform(
          _.indexBy(tables.rows, 'table_name'),
          function (result, table, tableName) {
            table = removeExcessTableFields(table)
            result[tableName] = _.extend(table, {
              columns: _.mapValues(
                _.indexBy(columnGroups[tableName], 'column_name'),
                (obj) => removeExcessColumnFields(obj)
              )
            })
          }
        ),
        constraints: _.transform(
          _.groupBy(constraints.rows, 'table_name'),
          function (result, table, tableName) {
            result[tableName] = _.mapValues(_.groupBy(table, 'column_name'),
                (obj) => obj.map((rec) => {
                  return removeExcessConstraintFields(rec)
                })
              )
          }
        )
      }
    })
}

function removeExcessTableFields(record) {
  const keys = ['table_schema', 'table_name']

  for (let field of Object.keys(record)) {
    if (null === record[field]) {
      delete record[field]
    }
  }

  return omit(keys, record)
}

function removeExcessColumnFields(record) {
  const keys = ['table_schema', 'table_name', 'column_name']

  // Skip default values of properties.
  if (true === record.is_nullable) {
    delete record.is_nullable
  }
  if ('pg_catalog' === record.udt_schema) {
    delete record.udt_schema
  }

  for (let field of Object.keys(record)) {
    if (null === record[field]) {
      delete record[field]
    }
  }

  return omit(keys, record)
}

function removeExcessConstraintFields(record) {
  const keys = ['table_schema', 'table_name', 'column_name']

  return omit(keys, record)
}
