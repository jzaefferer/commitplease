var styles = {
  'jquery': require('./styles/jquery.js'),
  'angular': require('./styles/angular.js')
}

var limits = require('./utils/limits')
var tickets = require('./utils/tickets')

var semver = require('semver')

module.exports = function (message, options) {
  if (message === undefined) {
    return ['Commit message is undefined, abort with error']
  } else if (
    !(typeof message === 'string' || message instanceof String)
  ) {
    return ['Commit message is not a string, abort with error']
  } else if (message.length === 0) {
    return ['Commit message is empty, abort with error']
  }

  var lines = message.split('\n')

  if (semver.valid(lines[0])) {
    return []
  }

  if (/^WIP|^Wip|^wip/.test(lines[0])) {
    return []
  }

  if (/^Merge branch|^Merge [0-9a-f]+ into [0-9a-f]+/.test(lines[0])) {
    return []
  }

  if (/^fixup!|^squash!/.test(lines[0])) {
    return []
  }

  var errors = []

  limits(lines, options, errors)
  tickets(lines, options, errors)

  styles[options.style](lines, options, errors)

  return errors
}
