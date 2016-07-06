const pg = require('pg')
const Client = pg.Client
const Promise = require('bluebird')
const _ = require('lodash')
const sql = require('./sql/pg')

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
    client.query(sql.getSequences, [schema]),
    client.query(sql.getColumns, [schema]),
    client.query(sql.getTables, [schema]),
    client.query(sql.getConstraints, [schema])
  ]

  return Promise.all(queries)
    .spread(function (sequences, columns, tables, constraints) {
      const columnGroups = _.groupBy(columns.rows, 'table_name')
      return {
        counts: {
          sequences: sequences.rowCount,
          constraints: constraints.rowCount,
          tables: tables.rowCount,
          columns: columns.rowCount
        },
        tables: _.transform(_.indexBy(tables.rows, 'table_name'), function (result, table, name) {
          result[name] = _.extend(table, {
            columns: _.indexBy(columnGroups[name], 'column_name')
          })
        }),
        constraints: _.transform(_.groupBy(constraints.rows, 'table_name'), function (result, table, tableName) {
          result[tableName] = _.groupBy(table, 'column_name')
        }),
        sequences: _.transform(_.groupBy(sequences.rows, 'table_name'), function (result, table, tableName) {
          result[tableName] = _.indexBy(sequences.rows, 'column_name')
        })
      }
    })
}
