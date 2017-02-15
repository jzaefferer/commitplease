var fs = require('fs')
var path = require('path')

var hooks = path.join(process.cwd(), '..', '..', '.git', 'hooks')

var dstCommitHook = path.join(hooks, 'commit-msg')
var srcCommitHook = path.relative(hooks, 'commit-msg-hook.js')

var dstPrepareHook = path.join(hooks, 'prepare-commit-msg')
var srcPrepareHook = path.relative(hooks, 'prepare-commit-msg-hook.js')

var dstHooks = [dstCommitHook, dstPrepareHook]
var srcHooks = [srcCommitHook, srcPrepareHook]

for (var i = 0; i < dstHooks.length; ++i) {
  var dstHook = dstHooks[i]
  var srcHook = srcHooks[i]

  if (fs.existsSync(dstHook) && fs.existsSync(srcHook)) {
    var githook = fs.readFileSync(dstHook)
    var comhook = fs.readFileSync(srcHook)

    if (githook.toString() === comhook.toString()) {
      console.log('Removing the following hook:')
      console.log(dstHook)

      fs.unlinkSync(dstHook)
    }
  }
}

try {
  var options = require('commitplease').getOptions()

  var oldMessagePath = path.join(
    process.cwd(), '..', '..', options.oldMessagePath
  )

  fs.unlinkSync(oldMessagePath)
} catch (err) {
  if (!/ENOENT/.test(err.message)) {
    throw err
  }
}
