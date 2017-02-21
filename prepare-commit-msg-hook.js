#!/usr/bin/env node

var fs = require('fs')

var options = require('commitplease').getOptions()

var oldMessagePath = options.oldMessagePath
var oldMessageSeconds = options.oldMessageSeconds

try {
  // There may be an old message that was previously rejected by us
  // Suggest it to the user so they do not have to start from scratch

  // Will throw ENOENT if no such file, ask forgiveness not permission
  var mtime = new Date(fs.statSync(oldMessagePath).mtime)

  // Date.now() - mtime.getTime() is milliseconds, convert to seconds
  var fresh = (Date.now() - mtime.getTime()) / 1000 < oldMessageSeconds

  // There are many scenarios that trigger the prepare-commit-msg hook
  // These scenarios pass different console parameters, see here:
  // https://www.kernel.org/pub/software/scm/git/docs/githooks.html
  //
  // A plain `git commit` is the only scenario that passes 3 entries
  // For all other scenarios (like `git commit -m`, squash or merge)
  // just delete oldMessagePath, do not actually suggest it to user
  var plain = process.argv === 3

  if (plain && fresh) {
    fs.writeFileSync(process.argv[2], fs.readFileSync(oldMessagePath))
  }

  fs.unlinkSync(oldMessagePath)
} catch (err) {
  if (!/ENOENT/.test(err.message)) {
    throw err
  }

  // there is no old message to reuse, swallow the exception
}
