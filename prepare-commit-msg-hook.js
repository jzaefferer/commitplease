#!/usr/bin/env node

var fs = require('fs')

var commitplease = require('commitplease')

var oldMessagePath = commitplease.defaults.oldMessagePath

if (fs.existsSync(oldMessagePath)) {
  // There is an old message that was previously rejected by us
  // Suggest it to the user so they do not have to start from scratch
  fs.writeFileSync(process.argv[2], fs.readFileSync(oldMessagePath).toString())

  fs.unlinkSync(oldMessagePath)
}
