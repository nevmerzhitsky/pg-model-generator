const {pipe} = require('ramda')
const {promised} = require('q')

module.exports = {
  asyncPipe
}

function asyncPipe(...args) {
  return pipe.apply(null, args.map(promised))
}
