;(function avoidSelfInstall () {
  var pkg = require('./package')
  var nameRegex = new RegExp('node_modules/' + pkg.name + '$')
  if (!nameRegex.test(process.cwd().replace(/\\/g, '/'))) {
    console.log('running install inside self, no need')
    process.exit(0)
  }
}())

var fs = require('fs')
var ini = require('ini')
var path = require('path')

var getOptions = function (repo) {
  var pkg = path.join(repo, 'package.json')
  var npm = path.join(repo, '.npmrc')

  pkg = fs.existsSync(pkg) && require(pkg) || {}
  npm = fs.existsSync(npm) && ini.parse(fs.readFileSync(npm, 'utf8')) || {}

  pkg = pkg.commitplease
  npm = npm.commitplease

  return {pkg: pkg, npm: npm}
}

var repo = path.resolve(__dirname, '../..')

var git = path.resolve(repo, '.git')
var hooks = path.resolve(git, 'hooks')

var options = getOptions(repo)

var pkg = options.pkg
var npm = options.npm
if (pkg && pkg.nohook) {
  console.log('package.json indicates to skip hook')
  process.exit(0)
} else if (npm && npm.nohook) {
  console.log('.npmrc indicates to skip hook')
  process.exit(0)
}

// If we are not in a git repository, bail out early.
if (!fs.existsSync(git) || !fs.lstatSync(git).isDirectory()) {
  console.error('Could not find git repo in ' + git)
  process.exit(0)
}

if (!fs.existsSync(hooks)) {
  fs.mkdirSync(hooks)
}

var hook = path.resolve(hooks, 'commit-msg')
var hookFile = path.relative(path.resolve(hooks), './commit-msg-hook.js')

var context = {
  hook: hook,
  create: function () {
    try {
      fs.writeFileSync(hook, fs.readFileSync(hookFile))
      fs.chmodSync(hook, '755')
    } catch (e) {
      if (/EPERM/.test(e.message)) {
        console.error('Failed to write commit-msg hook. ' +
          'Make sure you have the necessary permissions.')
      }
      throw e
    }
  },
  destroy: function () {
    fs.unlinkSync(hook)
  }
}

if (fs.existsSync(hook)) {
  context.hookExists = true
  var githook = fs.readFileSync(hook, 'utf-8')
  var comhook = fs.readFileSync(hookFile, 'utf-8')
  if (githook.toString() === comhook.toString()) {
    context.selfmadeHook = true
  }
}

module.exports = context
