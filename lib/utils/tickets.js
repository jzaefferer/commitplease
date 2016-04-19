module.exports = function (lines, options, errors) {
  var marker = new RegExp(options.markerPattern, 'i')
  var action = new RegExp(options.actionPattern)
  var ticket = new RegExp(options.ticketPattern)

  lines.forEach(function (line, index) {
    if (marker.test(line)) {
      if (!action.test(line) && !ticket.test(line)) {
        errors.push(
          'Invalid ticket reference, must be ' + ticket + '\n' +
          'Was: ' + line
        )
      }
    }
  })
}
