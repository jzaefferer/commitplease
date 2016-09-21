var defaults = {
  jquery: {
    style: 'jquery',
    limits: {
      firstLine: 72,
      otherLine: 80
    },
    markerPattern: '^(clos|fix|resolv)(e[sd]|ing)',
    actionPattern: '^([Cc]los|[Ff]ix|[Rr]esolv)(e[sd]|ing)' +
                   '\\s+[^\\s\\d]+(\\s|$)',
    ticketPattern: '^(' +
                   '(([Cc]los|[Ff]ix|[Rr]esolv)(e[sd]))' +
                   '|' +
                   '([Cc]onnects)' +
                   '|' +
                   '(([Cc]onnect|[Cc]onnects|[Cc]onnected) to)' +
                   ')' +
                   ' (.*#|gh-|[A-Z]{2,}-)[0-9]+',
    // jQuery specific settings follow:
    component: true,
    components: []
  },
  angular: {
    style: 'angular',
    limits: {
      firstLine: 100,
      otherLine: 100
    },
    markerPattern: '^(clos|fix|resolv)(e[sd]|ing)',
    actionPattern: '^([Cc]los|[Ff]ix|[Rr]esolv)(e[sd]|ing)' +
                   '\\s+[^\\s\\d]+(\\s|$)',
    ticketPattern: '^(' +
                   '(([Cc]los|[Ff]ix|[Rr]esolv)(e[sd]))' +
                   '|' +
                   '([Cc]onnects)' +
                   '|' +
                   '(([Cc]onnect|[Cc]onnects|[Cc]onnected) to)' +
                   ')' +
                   ' (.*#|gh-|[A-Z]{2,}-)[0-9]+',
    // Angular specific settings follow:
    types: [
      'feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore'
    ],
    scope: '\\S+.*'
  }
}

module.exports = defaults
