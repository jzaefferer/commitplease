module.exports = function (lines, options, errors) {
  var scheme = '<type>(<scope>): <subject>'
  var prefix = 'First line must be ' + scheme + '\n'

  var line = lines[0]

  if (line.startsWith('revert: ')) {
    line = line.replace(/^revert: /, '')
    prefix = 'First line must be revert: ' + scheme + '\n'
  } else if (line.startsWith('revert')) {
    errors.push(
      'If this is a revert of a previous commit, please write:\n' +
      'revert: <type>(<scope>): <subject>'
    )

    return
  }

  if (line.indexOf('(') === -1) {
    errors.push(prefix + 'Need an opening parenthesis: (')

    return
  }

  var type = line.replace(/\(.*/, '')

  if (!type) {
    errors.push(
      prefix + '<type> was empty, must be one of these:\n' +
      options.types.join(', ')
    )

    return
  }

  if (options.types.indexOf(type) === -1) {
    errors.push(
      prefix + '<type> invalid, was "' + type +
      '", must be one of these:\n' + options.types.join(', ')
    )

    return
  }

  if (line.indexOf(')') === -1) {
    errors.push(prefix + 'Need a closing parenthesis after scope: <scope>)')

    return
  }

  var scope = line.slice(line.indexOf('(') + 1, line.indexOf(')'))

  if (!RegExp(options.scope).test(scope)) {
    errors.push(
      prefix + 'Scope ' + scope + ' does not match ' + options.scope
    )

    return
  }

  if (line.indexOf(type + '(' + scope + '):') === -1) {
    errors.push(prefix + 'Need a colon after the closing parenthesis: ):')

    return
  }

  var subject = line.split(':')[1]

  if (!subject.startsWith(' ')) {
    errors.push(prefix + 'Need a space after colon: ": "')

    return
  }

  subject = subject.slice(1, subject.length)

  if (subject.length === 0) {
    errors.push(prefix + '<subject> must not be empty')

    return
  }

  if (!/^[a-z]/.test(subject)) {
    errors.push('<subject> must start with a lowercase letter')

    return
  }

  if (subject[subject.length - 1] === '.') {
    errors.push('<subject> must not end with a dot')

    return
  }
}
