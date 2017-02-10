var fs = require('fs')
var path = require('path')
var chalk = require('chalk')

var options = require('./index.js').getOptions()

if (options && options.nohook) {
  console.log('commitplease: package.json or .npmrc set to skip hook')
  process.exit(0)
}

function xmkdirSync (path, mode) {
  try {
    fs.mkdirSync(path, mode)
  } catch (err) {
    if (/EPERM/.test(err.message)) {
      console.error('Failed to create: ' + path)
      console.error('Make sure you have the necessary permissions')
      process.exit(1)
    } else if (/EEXIST/.test(err.message)) {
      // do nothing, but this might be a file, not a directory
    } else if (/ENOTDIR/.test(err.message)) {
      console.log('Will not install in a git submodule')
      process.exit(0)
    } else {
      console.error(err)
      process.exit(1)
    }
  }
}

var git = path.resolve(process.cwd(), '..', '..', '.git')
var hooks = path.join(git, 'hooks')

xmkdirSync(git, parseInt('755', 8))
xmkdirSync(hooks, parseInt('755', 8))

var dstCommitHook = path.join(hooks, 'commit-msg')
var srcCommitHook = path.relative(hooks, 'commit-msg-hook.js')

var dstPrepareHook = path.join(hooks, 'prepare-commit-msg')
var srcPrepareHook = path.relative(hooks, 'prepare-commit-msg-hook.js')

var dstHooks = [dstCommitHook, dstPrepareHook]
var srcHooks = [srcCommitHook, srcPrepareHook]

// loop twice, try to avoid getting partially installed

var i, dstHook, srcHook

for (i = 0; i < dstHooks.length; ++i) {
  dstHook = dstHooks[i]

  if (fs.existsSync(dstHook)) {
    console.log(chalk.red('The following hook already exists:\n' + dstHook))
    console.log(chalk.red('Remove it and install this package again to install commitplease properly'))

    process.exit(0)
  }
}

for (i = 0; i < dstHooks.length; ++i) {
  dstHook = dstHooks[i]
  srcHook = srcHooks[i]

  try {
    fs.writeFileSync(dstHook, fs.readFileSync(srcHook))
    fs.chmodSync(dstHook, '755')
  } catch (e) {
    if (/EPERM/.test(e.message)) {
      console.error(
        chalk.red(
          'Failed to write to ' + dstHook +
          '\nMake sure you have the necessary permissions.'
        )
      )
    }

    throw e
  }
}
