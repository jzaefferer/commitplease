var process = require('child_process')
var command = 'git config --get core.commentchar'
var comment = '#'

try {
  comment = process.execSync(command).toString().trim()
} catch (error) {
  // errors.status === 1 if the following:
  // a) 'core.commentchar' has not been set (git defaults it to #)
  // b) this is not a git repository
  // c) maybe something else?
  if (error.status !== 1) {
    throw error
  }
}

var scissor = /# ------------------------ >8 ------------------------[\s\S]+/
module.exports = function (value) {
  var isComment = new RegExp('^' + comment)
  return value.replace(scissor, '').split(/\n/).filter(function (line) {
    return !isComment.test(line)
  }).join('\n').trim()
}
