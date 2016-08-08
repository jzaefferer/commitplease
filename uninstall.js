var fs = require('fs')
var path = require('path')

var hooks = path.join(process.cwd(), '..', '..', '.git', 'hooks')

var dstHook = path.join(hooks, 'commit-msg')
var srcHook = path.relative(hooks, 'commit-msg-hook.js')

if (fs.existsSync(dstHook) && fs.existsSync(srcHook)) {
  var githook = fs.readFileSync(dstHook, 'utf-8')
  var comhook = fs.readFileSync(srcHook, 'utf-8')
  if (githook.toString() === comhook.toString()) {
    console.log('Removing the hook installed by commitplease')
    fs.unlinkSync(dstHook)
  }
}
