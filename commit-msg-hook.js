#!/usr/bin/env node

var fs = require('fs')
var ini = require('ini')
var path = require('path')
var chalk = require('chalk')

var repo = path.resolve(__dirname, '../..')
var pkg = path.join(repo, 'package.json')
var npm = path.join(repo, '.npmrc')

pkg = fs.existsSync(pkg) && require(pkg) || {}
npm = fs.existsSync(npm) && ini.parse(fs.readFileSync(npm, 'utf8')) || {}

pkg = pkg.commitplease
npm = npm.commitplease

if (pkg && pkg.nohook === true) {
  console.log(
    chalk.blue('commitplease: nohook set in package.json, skipping check')
  )

  process.exit(0)
} else if (npm && npm.nohook === true) {
  console.log(
    chalk.blue('commitplease: nohook set in .npmrc, skipping check')
  )

  process.exit(0)
}

// commitplease-original
require('commitplease')
