var fs = require('fs')
var ini = require('ini')
var path = require('path')
var chalk = require('chalk')
var Git = require('git-tools')

var validate = require('./lib/validate')
var sanitize = require('./lib/sanitize')
var defaults = require('./lib/defaults')

// If there is a path in process.env.PATH that looks like this:
// path = prefix + suffix (where suffix is the function argument)
// then slice off the suffix and return the prefix, otherwise undefiend
function sliceEnvPath (suffix) {
  var p = process.env.PATH.split(':').filter(
    function (p) {return p.endsWith(suffix)}
  )

  if (p.length === 1) {
    p = p[0].split(path.sep)

    p = p.slice(0, p.length - suffix.split(path.sep).length)
    return p.join(path.sep)
  }

  return undefined
}

// Need to find the path to the project that is installing or running
// commitplease. Previously, process.cwd() made the job easy but its
// output changed with node v8.1.2 (at least compared to 7.10.0)
function getProjectPath () {
  // Rely on npm to inject some path into PATH; However, the injected
  // path can both be relative or absolute, so add extra path.resolve()

  // During npm install, npm will inject a path that ends with
  // commitplease/node_modules/.bin into process.env.PATH
  var p = sliceEnvPath(
    path.join('node_modules', 'commitplease', 'node_modules', '.bin')
  )

  if (p !== undefined) {
    return path.resolve(p)
  }

  // During npm run, npm will inject a path that ends with
  // node_modules/.bin into process.env.PATH
  p = sliceEnvPath(path.join('node_modules', '.bin'))

  if (p !== undefined) {
    return path.resolve(p)
  }

  // During git commit there will be no process.env.PATH modifications
  // So, assume we are being run by git which will set process.cwd()
  // to the root of the project as described in the manual:
  // https://git-scm.com/docs/githooks/2.9.0
  return path.resolve(process.cwd())
}

function getOverrides (env) {
  var options = {}
  var prefix = 'npm_config_commitplease_'
  for (var key in env) {

    // For explicit environment variable overrides.
    // npm also sets these implicitly for CLI arguments (--commitplease-*),
    // and for commitplease_* prefixed entries in an .npmrc file.
    // Note that getOptions() has its own handling for npmrc files, because
    // we prefer entries to be in their own [commitplease] section,
    // which npm does not add individually into process.env.
    if (key.indexOf(prefix) !== -1) {
      options[key.replace(prefix, '')] = env[key]
    }
  }
  return options
}

function getOptions () {
  var projectPath = getProjectPath()

  var pkg = path.join(projectPath, 'package.json')
  var npm = path.join(projectPath, '.npmrc')

  pkg = fs.existsSync(pkg) && require(pkg) || {}
  npm = fs.existsSync(npm) && ini.parse(fs.readFileSync(npm, 'utf8')) || {}

  pkg = pkg.commitplease || {}
  npm = npm.commitplease || {}

  var overrides = getOverrides(process.env)

  var options = Object.assign(pkg, npm, overrides)

  var base = {
    'projectPath': projectPath,
    'oldMessagePath': defaults.oldMessagePath,
    'oldMessageSeconds': defaults.oldMessageSeconds
  }

  if (options === undefined ||
      options.style === undefined ||
      options.style === 'jquery') {
    return Object.assign(base, defaults.jquery, options)
  } else if (options.style === 'angular') {
    return Object.assign(base, defaults.angular, options)
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
