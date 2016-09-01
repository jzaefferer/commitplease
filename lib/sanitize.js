var scissor = /# ------------------------ >8 ------------------------[\s\S]+/

module.exports = function (value) {
  var isComment = new RegExp('^#')
  return value.replace(scissor, '').split(/\n/).filter(function (line) {
    return !isComment.test(line)
  }).join('\n').trim()
}
