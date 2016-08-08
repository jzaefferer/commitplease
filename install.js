var fs = require('fs')
var path = require('path')
var chalk = require('chalk')

var options = require('./index.js').getOptions()

if (options && options.nohook) {
  console.log('commitplease: package.json or .npmrc set to skip hook')
  process.exit(0)
}

var git = path.resolve(process.cwd(), '..', '..', '.git')
var hooks = path.join(git, 'hooks')

if (!fs.existsSync(git) || !fs.existsSync(hooks)) {
  fs.mkdirSync(git)
  fs.mkdirSync(hooks)
}

var dstHook = path.join(hooks, 'commit-msg')
var srcHook = path.relative(hooks, 'commit-msg-hook.js')

if (fs.existsSync(dstHook)) {
  console.log(chalk.red('A commit-msg hook already exists'))
  console.log(chalk.red('Remove it and install this package again to install commitplease properly'))
  process.exit(0)
}

try {
  fs.writeFileSync(dstHook, fs.readFileSync(srcHook))
  fs.chmodSync(dstHook, '755')
} catch (e) {
  if (/EPERM/.test(e.message)) {
    console.error(
      chalk.red(
        'Failed to write commit-msg hook. ' +
        'Make sure you have the necessary permissions.'
      )
    )
  }
  throw e
}
