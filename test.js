var validate = require('./lib/validate')
var sanitize = require('./lib/sanitize')

var messageWithMultipleLines = 'Component: short message\n' +
  '\n' +
  'Long description'

var messageWithDiff = 'Component: short message\n' +
  '\n' +
  'some text\n' +
  '# Long comment that has to be ignored line too long beyond 72 chars line too long beyond' +
  'line too long line too long line too long\n' +
  'more text\n' +
  '# ------------------------ >8 ------------------------\n' +
  '# Do not touch the line above.\n' +
  '# Everything below will be removed.\n' +
  'diff --git a/test.js b/test.js\n' +
  'index 36978ce..8edf326 100644\n' +
  'diff --git a/foo b/foo\n' +
  '-	\n' +
  '+	}, mment that has to be ignored line too long beyond 72 chars line too long beyond'

var testComponent = {
  components: [ 'Test' ]
}

var valid = [
  {
    msg: 'Component: short message'
  },
  {
    msg: messageWithMultipleLines
  },
  {
    msg: 'Component: short message\n' +
      '\n' +
      'Long description\n' +
      '\n' +
      'Closes #123'
  },
  {
    msg: 'Component: short message\n' +
      '\n' +
      'Closes jquery/jquery-mobile#123'
  },
  {
    msg: 'short message',
    options: {
      component: false
    }
  },
  {
    msg: 'Test: short message',
    options: {
      components: [ 'Test' ]
    }
  },
  {
    msg: 'Component: message over default of 50 but below limit off 70',
    options: {
      limits: {
        subject: 70
      }
    }
  },
  {
    msg: messageWithDiff
  },
  {
    msg: 'v1.13.0'
  },
  {
    msg: '0.0.1'
  },
  {
    msg: 'Component: Message\n#comment'
  },
  {
    msg: 'Component: short message\n' +
         '\n' +
         'Fixes some bug.\n' +
         'Fix some other bug.\n' +
         'And fix these bugs too.\n' +
         'And fixes other bugs too.\n'
  },
  {
    msg: 'Component: short message\n' +
         '\n' +
         'Resolves some issue.\n' +
         'Resolve some other issue.\n' +
         'And resolve these issues too.\n' +
         'And resolves some other issues too.\n'
  },
  {
    msg: 'Component: short message\n' +
         '\n' +
         'Closes some issue.\n' +
         'Close some other issue.\n' +
         'And close these issues too.\n' +
         'And closes some other issues too.'
  },
  {
    msg: 'Component: short message\n' +
         '\n' +
         'Fixes #1\n' +
         'Fixes #123'
  },
  {
    msg: 'Component: short message\n' +
         '\n' +
         'Fixes gh-1\n' +
         'Fixes gh-123'
  },
  {
    msg: 'Component: short message\n' +
         '\n' +
         'Fixes WEB-1\n' +
         'Fixes WEB-123'
  },
  {
    msg: 'Component: short message\n' +
         '\n' +
         'Fixes CRM-1\n' +
         'Fixes CRM-123'
  },
  {
    msg: "Merge branch 'one' into two"
  },
  {
    msg: 'Merge e8d808b into f040453'
  },
  {
    msg: 'fixup! for git to squash',
    options: testComponent
  },
  {
    msg: 'squash! for git to squish',
    options: testComponent
  },
  {
    msg: '[fix]: whatever fix',
    options: testComponent
  },
  {
    msg: '[Tmp]: do this and that',
    options: testComponent
  },
  {
    msg: 'fixedToolbar: Prevent resize'
  },
  {
    msg: 'Docs:Tests: Remove legacy code & add support comments where needed\n' +
         '\n' +
         'This commits backports some changes done in the patch to the then-existing\n' +
         'compat branch that removed support for old browsers and added some support\n' +
         'comments.\n' +
         '\n' +
         'Refs 90d7cc1d8b2ea7ac75f0eacb42439349c9c73278'
  },
  {
    msg: 'Support: improve support properties computation\n' +
         '\n' +
         '* Remove div from the memory if it is not needed anymore\n' +
         '\n' +
         '* Make `computeStyleTests` method a singleton\n' +
         '\n' +
         'Fixes gh-3018 Closes gh-3021'
  },
  {
    msg: 'Tests: add additional test for jQuery.isPlainObject\n' +
         '\n' +
         'Ref 00575d4d8c7421c5119f181009374ff2e7736127\n' +
         'Also see discussion in\n' +
         'https://github.com/jquery/jquery/pull/2970#discussion_r54970557'
  },
  {
    msg: 'Revert "Offset: account for scroll when calculating position"\n' +
         '\n' +
         'This reverts commit 2d715940b9b6fdeed005cd006c8bf63951cf7fb2.\n' +
         'This commit provoked new issues: gh-2836, gh-2828.\n' +
         'At the meeting, we decided to revert offending commit\n' +
         '(in all three branches - 2.2-stable, 1.12-stable and master)\n' +
         'and tackle this issue in 3.x.\n' +
         '\n' +
         'Fixes gh-2828'
  },
  {
    msg: 'Revert "Attributes: Remove undocumented .toggleClass( boolean ) signature"\n' +
         '\n' +
         'This reverts commit 53f798cf4d783bb813b4d1ba97411bc752b275f3.\n' +
         '\n' +
         '- Turns out this is documented, even if not fully. Need to deprecate before removal.',
    options: {
      limits: {
        subject: 90,
        other: 90
      }
    }
  },
  {
    msg: 'Event: Separate trigger/simulate into its own module\n' +
         '\n' +
         'Fixes gh-1864\n' +
         'Closes gh-2692\n' +
         '\n' +
         'This also pulls the focusin/out special event into its own module, since that\n' +
         'depends on simulate(). NB: The ajax module triggers events pretty heavily.'
  }
]

var ticketPattern = new RegExp(validate.defaults.ticketPattern)

var invalid = [
  {
    msg: '',
    expected: [ 'First line (subject) must not be empty' ],
    options: {
      component: false
    }
  },
  {
    msg: 'Test: Message',
    expected: [ "Component invalid, was 'Test', must be one of these: Build, Legacy" ],
    options: {
      components: [ 'Build', 'Legacy' ]
    }
  },
  {
    msg: '',
    expected: [
      'First line (subject) must not be empty',
      'First line (subject) must indicate the component',
      'First line (subject) must have a message after the component'
    ]
  },
  {
    msg: 'Component: short message but actually a little bit over default character limit',
    expected: [ 'First line (subject) must be no longer than 72 characters' ]
  },
  {
    msg: 'foo:',
    expected: [ 'First line (subject) must have a message after the component' ]
  },
  {
    msg: 'no component here',
    expected: [ 'First line (subject) must indicate the component' ]
  },
  {
    msg: 'component: bla\ntext on next line',
    expected: [ 'Second line must always be empty' ]
  },
  {
    msg: 'component: bla\n\nline too long beyond 80 chars line too long beyond' +
      'line too long line too long line too long',
    expected: [ 'Commit message line 3 too long: 91 characters, only 80 allowed. Was: line too long beyond[...]' ]
  },
  {
    msg: 'Docs: Fix a typo\n\nCloses: gh-155',
    expected: [ 'Invalid ticket reference, must be ' + ticketPattern + ', was: Closes: gh-155' ]
  },
  {
    msg: 'Bla: blub\n\nClosing #1',
    expected: [ 'Invalid ticket reference, must be ' + ticketPattern + ', was: Closing #1' ]
  },
  {
    msg: 'Bla: blub\n\nFixing gh-1',
    expected: [ 'Invalid ticket reference, must be ' + ticketPattern + ', was: Fixing gh-1' ]
  },
  {
    msg: 'Bla: blub\n\nResolving xy-9991',
    expected: [ 'Invalid ticket reference, must be ' + ticketPattern + ', was: Resolving xy-9991' ]
  },
  {
    msg: 'bla: blu\n\n# comment\nResolving xy12312312312',
    expected: [ 'Invalid ticket reference, must be ' + ticketPattern + ', was: Resolving xy12312312312' ]
  },
  {
    msg: 'Component: short message\n\nFixes #123',
    options: {
      ticketPattern: /^(Closes|Fixes) ([A-Z]{2,}-)[0-9]+/
    },
    expected: [ 'Invalid ticket reference, must be ' + '/^(Closes|Fixes) ([A-Z]{2,}-)[0-9]+/' + ', was: Fixes #123' ]
  }
]

exports.valid = function (test) {
  valid.forEach(function (check, index) {
    test.deepEqual(validate(sanitize(check.msg), check.options), [], 'valid ' + index +
      ' ' + check.msg)
  })
  test.done()
}

exports.invalid = function (test) {
  invalid.forEach(function (check, index) {
    test.deepEqual(validate(sanitize(check.msg), check.options), check.expected,
      'invalid ' + index + ' ' + check.msg)
  })
  test.done()
}

exports.sanitze = function (test) {
  test.strictEqual(sanitize(messageWithMultipleLines), messageWithMultipleLines)
  test.strictEqual(sanitize(messageWithDiff), 'Component: short message\n\nsome text\nmore text')
  test.done()
}
