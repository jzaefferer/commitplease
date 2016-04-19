module.exports = function (lines, options, errors) {
  var limits = options.limits
  lines.forEach(function (line, index) {
    var length = line.length
    if (index === 0) {
      if (length === 0) {
        errors.push('First line of commit message must not be empty')
      } else if (length > limits.firstLine) {
        errors.push(
          'First line of commit message must be no longer than ' +
          limits.firstLine + ' characters'
        )
      }
    } else if (index === 1 && length > 0) {
      errors.push('Second line must always be empty')
    } else if (length > limits.otherLine) {
      errors.push(
        'Commit message line ' + (index + 1) + ' too long: ' +
        length + ' characters, only ' + limits.otherLine + ' allowed.\n' +
        'Was: ' + line.substring(0, 20) + '[...]'
      )
    }
  })
}
