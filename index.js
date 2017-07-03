var fs = require('fs')
var ini = require('ini')
var path = require('path')
var chalk = require('chalk')
var Git = require('git-tools')

var endsWith = require('ends-with')
var objectAssign = require('object-assign')

var validate = require('./lib/validate')
var sanitize = require('./lib/sanitize')
var defaults = require('./lib/defaults')

// Need to find the path to the project that is installing
// commitplease. Previously, process.cwd() made the job easy but its
// output changed with node v8.1.2 (at least compared to 7.10.0)
function getProjectPath () {
  // Use the fact that npm will inject a path that ends with
  // commitplease/node_modules/.bin into process.env.PATH
  var p = process.env.PATH.split(':').filter(
    function (p) {
      return endsWith(p, path.join('commitplease', 'node_modules', '.bin'))
    }
  )

  if (p.length !== 1) {
    console.error(chalk.red('Failed to find project path\n'))

    // Just leave with zero so as not to interrupt install
    process.exit(0)
  }

  // Removing suffix node_modules/commitplease/node_modules/.bin will
  // give the absolute path to the project root
  p = p[0].split(path.sep)
  p = p.slice(0, p.length - 4)

  return path.sep + p.join(path.sep)
}

function getOptions () {
  var projectPath = getProjectPath()

  var pkg = path.join(projectPath, 'package.json')
  var npm = path.join(projectPath, '.npmrc')

  pkg = fs.existsSync(pkg) && require(pkg) || {}
  npm = fs.existsSync(npm) && ini.parse(fs.readFileSync(npm, 'utf8')) || {}

  pkg = pkg.commitplease || {}
  npm = npm.commitplease || {}

  var options = objectAssign(pkg, npm)

  var base = {
    'oldMessagePath': defaults.oldMessagePath,
    'oldMessageSeconds': defaults.oldMessageSeconds
  }

  if (options === undefined ||
      options.style === undefined ||
      options.style === 'jquery') {
    return objectAssign(base, defaults.jquery, options)
  } else if (options.style === 'angular') {
    return objectAssign(base, defaults.angular, options)
  }

  console.error(chalk.red(
    'Style ' + options.style + ' is not recognised\n' +
    'Did you mistype it in package.json?'
  ))

  process.exit(1)
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

    console.error('\nSee ' + options.guidelinesUrl)

    // save a poorly formatted message and reuse it at a later commit
    fs.writeFileSync(defaults.oldMessagePath, message)

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
      if (/Not a git repository/.test(error.message)) {
        console.log(error.message)

        process.exit(0)
      }

      if (/does not have any commits yet/.test(error.message)) {
        console.log(error.message)

        process.exit(0)
      }

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

module.exports.defaults = defaults
module.exports.getOptions = getOptions
