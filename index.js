var fs = require('fs')
var path = require('path')
var root = path.resolve(__dirname, '../..')
var chalk = require('chalk')
var validate = require('./lib/validate')
var sanitize = require('./lib/sanitize')
var options = fs.existsSync(path.join(root, 'package.json')) &&
  require(path.join(root, 'package.json')).commitplease || {}

module.exports = function (messageFile) {
  var message = sanitize(fs.readFileSync(messageFile).toString())
  var errors = validate(message, options)
  if (errors.length) {
    console.error('Invalid commit message, please fix the following issues:\n')
    console.error(chalk.red('- ' + errors.join('\n- ')))
    console.error()
    console.error('Commit message was:')
    console.error()
    console.error(chalk.green(message))
    process.exit(1)
  }
}
