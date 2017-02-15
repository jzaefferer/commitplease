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
  if ((Date.now() - mtime.getTime()) / 1000 < oldMessageSeconds) {
    fs.writeFileSync(process.argv[2], fs.readFileSync(oldMessagePath))
  }

  fs.unlinkSync(oldMessagePath)
} catch (err) {
  if (!/ENOENT/.test(err.message)) {
    throw err
  }

  // there is no old message to reuse, swallow the exception
}
