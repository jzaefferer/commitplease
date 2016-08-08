#!/usr/bin/env node

var commitplease = require('commitplease')

var options = commitplease.getOptions()

if (options && options.nohook === true) {
  console.log('commitplease: package.json or .npmrc set to skip check')

  process.exit(0)
}

commitplease()
