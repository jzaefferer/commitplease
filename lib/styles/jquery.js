module.exports = function (lines, options, errors) {
  if (!options.component) { return }

  var prefix = 'First line must be <Component>: <subject>\n'

  var line = lines[0]

  if (line.indexOf(':') === -1) {
    errors.push(prefix + 'Missing colon :')

    return
  }

  var component = line.replace(/:.*/, '')

  if (!component) {
    errors.push(
      prefix + '<Component> was empty, must be one of these:\n' +
      options.components.join(', ')
    )

    return
  }

  var components = options.components
  if (components.length && !components.some(
    function (x) { return RegExp('^' + x + '$').test(component) }
  )) {
    errors.push(
      prefix + '<Component> invalid, was "' + component +
      '", must be one of these:\n' + components.join(', ')
    )

    return
  }

  if (line.substring(line.indexOf(':') + 1).length < 1) {
    errors.push(prefix + '<subject> was empty')

    return
  }
}
