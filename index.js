var fs = require('fs')
var ini = require('ini')
var path = require('path')
var chalk = require('chalk')
var Git = require('git-tools')

var objectAssign = require('object-assign')

var validate = require('./lib/validate')
var sanitize = require('./lib/sanitize')

function getOptions () {
  var pkg = path.join(process.cwd(), 'package.json')
  var npm = path.join(process.cwd(), '.npmrc')

  pkg = fs.existsSync(pkg) && require(pkg) || {}
  npm = fs.existsSync(npm) && ini.parse(fs.readFileSync(npm, 'utf8')) || {}

  pkg = pkg.commitplease || {}
  npm = npm.commitplease || {}

  return objectAssign(pkg, npm)
}

function runValidate (message, options) {
  var errors = validate(sanitize(message), options)

  if (errors.length) {
    console.error('Invalid commit message, please fix:\n')
    console.error(chalk.red('- ' + errors.join('\n- ')))
    console.error()
    console.error('Commit message was:')
    console.error()
    console.error(chalk.green(sanitize(message)))

    if (options.style === undefined || options.style === 'jquery') {
      console.error('\nSee https://bit.ly/jquery-guidelines')
    } else if (options.style === 'angular') {
      console.error('\nSee https://bit.ly/angular-guidelines')
    }

    process.exit(1)
  }
}

module.exports = function () {
  var argv = process.argv.slice(2)
  var help = argv.some(function (value) {
    if (value === '-h' || value === '--help') {
      return true
    }
  })

  if (argv.length > 1 || help) {
    console.log(
      'Usage: commitplease [committish]\n\n' +
      'committish      a commit range passed to git log\n\n' +
      'Examples:\n\n' +
      '1. Check all commits on branch master:\n' +
      'commitplease master\n\n' +
      '2. Check all commits on branch feature but not on master:\n' +
      'commitplease master..feature\n\n' +
      '3. Check the latest 1 commit (n works too):\n' +
      'commitplease -1\n\n' +
      '4. Check all commits between 84991d and 2021ce\n' +
      'commitplease 84991d..2021ce\n\n' +
      '5. Check all commits starting with 84991d\n' +
      'commitplease 84991d..\n\n' +
      'Docs on git commit ranges: https://bit.ly/commit-range'
    )

    process.exit(0)
  }

  var options = getOptions()
  var message = path.join('.git', 'COMMIT_EDITMSG')

  if (path.normalize(argv[0]) === message) {
    runValidate(fs.readFileSync(message, 'utf8').toString(), options)

    process.exit(0)
  }

  var committish = 'HEAD'
  if (argv.length !== 0) {
    committish = argv[0]
  }

  var repo = new Git(process.cwd())

  var secret = '--++== CoMMiTPLeaSe ==++--'
  var format = '--format=%B' + secret

  repo.exec('log', format, committish, function (error, messages) {
    if (error) {
      console.error(error)
      process.exit(1)
    }

    messages = messages.trim().split(secret)
    messages.pop()

    for (var i = 0; i < messages.length; ++i) {
      runValidate(messages[i], options)
    }
  })
}

module.exports.getOptions = getOptions
