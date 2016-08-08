#!/usr/bin/env node

var fs = require('fs')
var ini = require('ini')
var path = require('path')
var chalk = require('chalk')

var merge = require('mout/object/merge')

var validate = require('./lib/validate')
var sanitize = require('./lib/sanitize')

function getOptions () {
  var pkg = path.join(process.cwd(), 'package.json')
  var npm = path.join(process.cwd(), '.npmrc')

  pkg = fs.existsSync(pkg) && require(pkg) || {}
  npm = fs.existsSync(npm) && ini.parse(fs.readFileSync(npm, 'utf8')) || {}

  pkg = pkg.commitplease || {}
  npm = npm.commitplease || {}

  return merge(pkg, npm)
}

module.exports = function () {
  var options = getOptions()

  var messageFile = path.join(process.cwd(), '.git', 'COMMIT_EDITMSG')
  var message = sanitize(fs.readFileSync(messageFile, 'utf8').toString())
  var errors = validate(message, options)
  if (errors.length) {
    console.error('Invalid commit message, please fix:\n')
    console.error(chalk.red('- ' + errors.join('\n- ')))
    console.error()
    console.error('Commit message was:')
    console.error()
    console.error(chalk.green(message))

    if (options.style === undefined || options.style === 'jquery') {
      console.error('\nSee https://bit.ly/jquery-guidelines')
    } else if (options.style === 'angular') {
      console.error('\nSee https://bit.ly/angular-guidelines')
    }

    process.exit(1)
  }
}

module.exports.getOptions = getOptions
