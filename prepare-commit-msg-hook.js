#!/usr/bin/env node

var fs = require('fs')

var getOptions = require('commitplease').getOptions

var options = getOptions()

var oldMessagePath = options.oldMessagePath
var oldMessageSeconds = options.oldMessageSeconds

if (fs.existsSync(oldMessagePath)) {
  // There is an old message that was previously rejected by us
  // Suggest it to the user so they do not have to start from scratch

  var mtime = new Date(fs.statSync(oldMessagePath).mtime)

  // Date.now() - mtime.getTime() is milliseconds, convert to minutes
  if ((Date.now() - mtime.getTime()) / 1000 < oldMessageSeconds) {
    fs.writeFileSync(
      process.argv[2], fs.readFileSync(oldMessagePath).toString()
    )
  }

  fs.unlinkSync(oldMessagePath)
}
