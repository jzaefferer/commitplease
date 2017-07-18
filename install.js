var fs = require('fs')
var path = require('path')
var chalk = require('chalk')

var options = require('./index.js').getOptions()

// Is this a self-install? If so, do not copy hooks and quit early
var pkgPath = path.join(options.projectPath, 'package.json')
var pkg = fs.existsSync(pkgPath) && require(pkgPath)

if (pkg && pkg.name && pkg.name === 'commitplease') {
  console.log('commitplease: self-install detected, skipping hooks')
  process.exit(0)
}

if (options.nohook) {
  console.log('commitplease: package.json or .npmrc set to skip hooks')
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

var git = path.join(options.projectPath, '.git')

var dstHooksPath = path.join(options.projectPath, '.git', 'hooks')
var srcHooksPath = path.join(options.projectPath, 'node_modules', 'commitplease')

xmkdirSync(git, parseInt('755', 8))
xmkdirSync(dstHooksPath, parseInt('755', 8))

var dstCommitHook = path.join(dstHooksPath, 'commit-msg')
var srcCommitHook = path.join(srcHooksPath, 'commit-msg-hook.js')

var dstPrepareHook = path.join(dstHooksPath, 'prepare-commit-msg')
var srcPrepareHook = path.join(srcHooksPath, 'prepare-commit-msg-hook.js')

var dstHooks = [dstCommitHook, dstPrepareHook]
var srcHooks = [srcCommitHook, srcPrepareHook]

// loop twice, try to avoid getting partially installed

dstHooks.forEach(function (dstHook) {
  if (fs.existsSync(dstHook)) {
    console.log(chalk.red('The following hook already exists:\n' + dstHook))
    console.log(chalk.red('Remove it and install this package again to install commitplease properly'))

    process.exit(0)
  }
})

dstHooks.forEach(function (dstHook, i) {
  var srcHook = srcHooks[i]

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
})
