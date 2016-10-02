var validate = require('./lib/validate')
var sanitize = require('./lib/sanitize')
var defaults = require('./lib/defaults')

var objectAssign = require('object-assign')

var jqueryColon =
    'First line must be <Component>: <subject>\n' +
    'Missing colon :'
var jqueryComponent =
    'First line must be <Component>: <subject>\n' +
    '<Component> invalid, was "Component", must be one of these:\n'
var jqueryEmptyComponent =
    'First line must be <Component>: <subject>\n' +
    '<Component> was empty, must be one of these:\n'
var jqueryTestComponent =
    'First line must be <Component>: <subject>\n' +
    '<Component> invalid, was "Test", must be one of these:\n'
var jqueryFixComponent =
    'First line must be <Component>: <subject>\n' +
    '<Component> invalid, was "[fix]", must be one of these:\n'
var jqueryTmpComponent =
    'First line must be <Component>: <subject>\n' +
    '<Component> invalid, was "[Tmp]", must be one of these:\n'
var jqueryEmptySubject =
    'First line must be <Component>: <subject>\n' +
    '<subject> was empty'
var jqueryCommitMessageEmpty =
    'Commit message is empty, abort with error'
var jqueryFirstLine72 =
    'First line of commit message must be no longer than 72 characters'

var jquery0 = defaults.jquery

var jquery1 = objectAssign(
  {}, defaults.jquery, {component: false}
)

var jquery2 = objectAssign(
  {}, defaults.jquery, {components: ['Build', 'Legacy']}
)

var jquery3 = objectAssign(
  {}, defaults.jquery, {
    markerPattern: '^((clos|fix|resolv)(e[sd]|ing))|(refs?)',
    ticketPattern: '^((Closes|Fixes) ([a-zA-Z]{2,}-)[0-9]+)|(Refs? [^#])'
  }
)

var jquery4 = objectAssign(
  {}, defaults.jquery, {components: ['^\\[\\w+-\\d+\\]']}
)

var profiles0 = [jquery0, jquery1, jquery3]

var messages0 = [
  {
    msg: 'Component: short message'
  },
  {
    msg: 'Component: short message\n\n' +
         'Long description'
  },
  {
    msg: 'Component: short message\n\n' +
         'Long description\n\n' +
         'That spans many paragraphs'
  },
  {
    msg: 'Component: short message\n' +
         '#comment'
  },
  {
    msg: 'Component: short message\n' +
         '# comment'
  },
  {
    msg: 'Component: short message\n' +
         '#                  comment'
  },
  {
    msg: '# comment\n' +
         'Component: short message'
  },
  {
    msg: 'Component: short message\n' +
         'text on next line',
    reasons: new Map([
      [jquery0, [ 'Second line must always be empty' ]],
      [jquery1, [ 'Second line must always be empty' ]],
      [jquery3, [ 'Second line must always be empty' ]]
    ])
  },
  {
    msg: 'No component here, short message',
    accepts: [jquery1],
    reasons: new Map([
      [jquery0, [jqueryColon]],
      [jquery2, [jqueryColon]],
      [jquery3, [jqueryColon]],
      [jquery4, [jqueryColon]]
    ])
  },
  {
    msg: ':No component here, short message',
    reasons: new Map([
      [jquery0, [jqueryEmptyComponent]],
      [jquery3, [jqueryEmptyComponent]]
    ])
  },
  {
    msg: '# comment\n' +
         'No component here, short message',
    accepts: [jquery1],
    reasons: new Map([
      [jquery0, [jqueryColon]],
      [jquery3, [jqueryColon]]
    ])
  },
  {
    msg: 'Build: short message',
    accepts: [jquery2]
  },
  {
    msg: '[AB-42]: short message',
    accepts: [jquery4]
  },
  {
    msg: 'Test: short message',
    reasons: new Map([
      [jquery2, [jqueryTestComponent + jquery2.components.join(', ')]],
      [jquery4, [jqueryTestComponent + jquery4.components.join(', ')]]
    ])
  },
  {
    msg: 'Component: short message\n' +
         '# Long comments still have to be ignored' +
         'even though they are longer than 72 characters' +
         'notice the absense of newline character in test'
  },
  {
    msg: 'Component: short message' +
         ' but actually a little bit over default character limit',
    reasons: new Map([
      [jquery0, [jqueryFirstLine72]],
      [jquery1, [jqueryFirstLine72]],
      [jquery2, [jqueryFirstLine72, jqueryComponent + jquery2.components.join(', ')]],
      [jquery3, [jqueryFirstLine72]],
      [jquery4, [jqueryFirstLine72, jqueryComponent + jquery4.components.join(', ')]]
    ])
  },
  {
    msg: 'Component: short message\n\n' +
         'Long description is way past the 80 characters limit' +
         'Long description is way past the 80 characters limit',
    reasons: new Map([
      [jquery0,
       [ 'Commit message line 3 too long: 104 characters, only 80 allowed.\n' +
         'Was: Long description is [...]' ]
      ],
      [jquery1,
       ['Commit message line 3 too long: 104 characters, only 80 allowed.\n' +
         'Was: Long description is [...]']
      ],
      [jquery3,
       ['Commit message line 3 too long: 104 characters, only 80 allowed.\n' +
         'Was: Long description is [...]']
      ]
    ])
  },
  {
    msg: 'Component:',
    accepts: [jquery1],
    reasons: new Map([
      [jquery0, [jqueryEmptySubject]],
      [jquery3, [jqueryEmptySubject]]
    ])
  },
  {
    msg: 'Build:',
    accepts: [jquery1],
    reasons: new Map([
      [jquery0, [jqueryEmptySubject]],
      [jquery2, [jqueryEmptySubject]],
      [jquery3, [jqueryEmptySubject]]
    ])
  },
  {
    msg: '[AB-42]:',
    accepts: [jquery1],
    reasons: new Map([
      [jquery0, [jqueryEmptySubject]],
      [jquery3, [jqueryEmptySubject]],
      [jquery4, [jqueryEmptySubject]]
    ])
  },
  {
    msg: 'Component0:Component1: short message\n\n'
  },
  {
    msg: 'Component: short message\n\n' +
         '1. List element\n' +
         '2. List element\n\n' +
         '* List element\n' +
         '* List element\n\n' +
         '- List element\n' +
         '- List element\n\n' +
         '+ List element\n' +
         '+ List element'
  },
  {
    msg: 'Component: message over default of 50 but below limit of 70'
  },
  {
    msg: 'Component: short message\n\n' +
         'Fixes some bug.\n' +
         'Fix some other bug.\n' +
         'And fix these bugs too.\n' +
         'And fixes other bugs too.'
  },
  {
    msg: 'Component: short message\n\n' +
         'Resolves some issue.\n' +
         'Resolve some other issue.\n' +
         'And resolve these issues too.\n' +
         'And resolves some other issues too.'
  },
  {
    msg: 'Component: short message\n\n' +
         'Closes some issue.\n' +
         'Close some other issue.\n' +
         'And close these issues too.\n' +
         'And closes some other issues too.'
  },
  {
    msg: 'Component: short message\n\n' +
         'Fixes #1\n' +
         'Fixes #123',
    reasons: new Map([
      [jquery3, [
        'Invalid ticket reference, must be /' + jquery3.ticketPattern + '/\nWas: Fixes #1',
        'Invalid ticket reference, must be /' + jquery3.ticketPattern + '/\nWas: Fixes #123'
      ]]
    ])
  },
  {
    msg: 'Component: short message\n\n' +
         'fixes #1\n' +
         'fixes #123',
    reasons: new Map([
      [jquery3, [
        'Invalid ticket reference, must be /' + jquery3.ticketPattern + '/\nWas: fixes #1',
        'Invalid ticket reference, must be /' + jquery3.ticketPattern + '/\nWas: fixes #123'
      ]]
    ])
  },
  {
    msg: 'Component: short message\n\n' +
         'Fixes #1 Fixes #123',
    reasons: new Map([
      [jquery3, [
        'Invalid ticket reference, must be /' + jquery3.ticketPattern + '/\nWas: Fixes #1 Fixes #123'
      ]]
    ])
  },
  {
    msg: 'Component: short message\n\n' +
         'Fixes jquery/jquery#1\n' +
         'Fixes jquery/jquery#123',
    reasons: new Map([
      [jquery3, [
        'Invalid ticket reference, must be /' + jquery3.ticketPattern + '/\nWas: Fixes jquery/jquery#1',
        'Invalid ticket reference, must be /' + jquery3.ticketPattern + '/\nWas: Fixes jquery/jquery#123'
      ]]
    ])
  },
  {
    msg: 'Component: short message\n\n' +
         'Fixes jquery/jquery#1 Fixes jquery/jquery#123',
    reasons: new Map([
      [jquery3, [
        'Invalid ticket reference, must be /' + jquery3.ticketPattern + '/\nWas: Fixes jquery/jquery#1 Fixes jquery/jquery#123'
      ]]
    ])
  },
  {
    msg: 'Component: short message\n\n' +
         'Fixes gh-1\n' +
         'Fixes gh-123'
  },
  {
    msg: 'Component: short message\n\n' +
         'Fixes gh-1 Fixes gh-123'
  },
  {
    msg: 'Component: short message\n\n' +
         'Fixes WEB-1\n' +
         'Fixes WEB-123'
  },
  {
    msg: 'Component: short message\n\n' +
         'Fixes WEB-1 Fixes WEB-123'
  },
  {
    msg: 'Component: short message\n\n' +
         'Fixes CRM-1\n' +
         'Fixes CRM-123'
  },
  {
    msg: 'Component: short message\n\n' +
         'Fixes CRM-1 Fixes CRM-123'
  },
  {
    msg: 'Component: short message\n\n' +
         'Closes #1\n' +
         'Closes #123',
    reasons: new Map([
      [jquery3, [
        'Invalid ticket reference, must be /' + jquery3.ticketPattern + '/\nWas: Closes #1',
        'Invalid ticket reference, must be /' + jquery3.ticketPattern + '/\nWas: Closes #123'
      ]]
    ])
  },
  {
    msg: 'Component: short message\n\n' +
         'closes #1\n' +
         'closes #123',
    reasons: new Map([
      [jquery3, [
        'Invalid ticket reference, must be /' + jquery3.ticketPattern + '/\nWas: closes #1',
        'Invalid ticket reference, must be /' + jquery3.ticketPattern + '/\nWas: closes #123'
      ]]
    ])
  },
  {
    msg: 'Component: short message\n\n' +
         'Closes #1 Closes #123',
    reasons: new Map([
      [jquery3, [
        'Invalid ticket reference, must be /' + jquery3.ticketPattern + '/\nWas: Closes #1 Closes #123'
      ]]
    ])
  },
  {
    msg: 'Component: short message\n\n' +
         'Closes jquery/jquery#1\n' +
         'Closes jquery/jquery#123',
    reasons: new Map([
      [jquery3, [
        'Invalid ticket reference, must be /' + jquery3.ticketPattern + '/\nWas: Closes jquery/jquery#1',
        'Invalid ticket reference, must be /' + jquery3.ticketPattern + '/\nWas: Closes jquery/jquery#123'
      ]]
    ])
  },
  {
    msg: 'Component: short message\n\n' +
         'Closes jquery/jquery#1 Closes jquery/jquery#123',
    reasons: new Map([
      [jquery3, [
        'Invalid ticket reference, must be /' + jquery3.ticketPattern + '/\nWas: Closes jquery/jquery#1 Closes jquery/jquery#123'
      ]]
    ])
  },
  {
    msg: 'Component: short message\n\n' +
         'Closes gh-1\n' +
         'Closes gh-123'
  },
  {
    msg: 'Component: short message\n\n' +
         'Closes gh-1 Closes gh-123'
  },
  {
    msg: 'Component: short message\n\n' +
         'Closes WEB-1\n' +
         'Closes WEB-123'
  },
  {
    msg: 'Component: short message\n\n' +
         'Closes WEB-1 Closes WEB-123'
  },
  {
    msg: 'Component: short message\n\n' +
         'Closes CRM-1\n' +
         'Closes CRM-123'
  },
  {
    msg: 'Component: short message\n\n' +
         'Closes CRM-1 Closes CRM-123'
  },
  {
    msg: 'Component: short message\n\n' +
         'Refs #1',
    reasons: new Map([
      [jquery3, ['Invalid ticket reference, must be /' + jquery3.ticketPattern + '/\nWas: Refs #1']]
    ])
  },
  {
    msg: 'Component: short message\n\n' +
         'Refs gh-1\n'
  },
  {
    msg: 'Component: short message\n\n' +
         'Refs WEB-1'
  },
  {
    msg: 'Component: short message\n\n' +
         'Refs 90d828b'
  },
  {
    msg: 'Component: short message\n\n' +
         'Refs jquery/jquery#1'
  },
  {
    msg: 'Component: short message\n\n' +
         'Refs short text'
  },
  {
    msg: 'Component: short message\n\n' +
         'Refs github.com/wiki#link'
  },
  {
    msg: 'Component: short message\n\n' +
         'Ref #1',
    reasons: new Map([
      [jquery3, ['Invalid ticket reference, must be /' + jquery3.ticketPattern + '/\nWas: Ref #1']]
    ])
  },
  {
    msg: 'Component: short message\n\n' +
         'Ref gh-1\n'
  },
  {
    msg: 'Component: short message\n\n' +
         'Ref WEB-1'
  },
  {
    msg: 'Component: short message\n\n' +
         'Ref 90d828b'
  },
  {
    msg: 'Component: short message\n\n' +
         'Ref jquery/jquery#1'
  },
  {
    msg: 'Component: short message\n\n' +
         'Ref short text'
  },
  {
    msg: 'Component: short message\n\n' +
         'Ref github.com/wiki#link'
  },
  {
    msg: 'Component: short message\n\n' +
         'Connect #1\n' +
         'Connect to #1\n' +
         'Connects to #1\n' +
         'Connected to #1'
  },
  {
    msg: 'Component: short message\n\n' +
         'connect #1\n' +
         'connect to #1\n' +
         'connects to #1\n' +
         'connected to #1'
  },
  {
    msg: 'Component: short message\n\n' +
         'Fixes #123\n' +
         'Fixes #1 Fixes #123\n' +
         'Fixes gh-123\n' +
         'Fixes gh-1 Fixes gh-123\n' +
         'Fixes WEB-123\n' +
         'Fixes WEB-1 Fixes WEB-123\n' +
         'Fixes CRM-123\n' +
         'Fixes CRM-1 Fixes CRM-123\n',
    rejects: [jquery3]
  },
  {
    msg: 'Component: short message\n\n' +
         'Closes #123\n' +
         'Closes #1 Closes #123\n' +
         'Closes gh-123\n' +
         'Closes gh-1 Closes gh-123\n' +
         'Closes WEB-123\n' +
         'Closes WEB-1 Closes WEB-123\n' +
         'Closes CRM-123\n' +
         'Closes CRM-1 Closes CRM-123\n',
    rejects: [jquery3]
  },
  {
    msg: 'Component: short message\n\n' +
         'Closes #123\n' +
         'Fixes #1 Closes #123\n' +
         'Fixes gh-123\n' +
         'Closes gh-1 Fixes gh-123\n' +
         'Closes WEB-123\n' +
         'Fixes WEB-1 Closes WEB-123\n' +
         'Fixes CRM-123\n' +
         'Closes CRM-1 Fixes CRM-123\n',
    rejects: [jquery3]
  },
  {
    msg: 'Component: short message\n\n' +
         'Long description\n\n' +
         'Closes #42\n\n' +
         'An afterthought is ok',
    reasons: new Map([
      [jquery3, [ 'Invalid ticket reference, must be /' + jquery3.ticketPattern + '/\nWas: Closes #42' ]]
    ])
  },
  {
    msg: 'Component: short message\n\n' +
         'Closes: gh-1',
    reasons: new Map([
      [jquery0, [ 'Invalid ticket reference, must be /' + jquery0.ticketPattern + '/\nWas: Closes: gh-1' ]],
      [jquery1, [ 'Invalid ticket reference, must be /' + jquery1.ticketPattern + '/\nWas: Closes: gh-1' ]],
      [jquery3, [ 'Invalid ticket reference, must be /' + jquery3.ticketPattern + '/\nWas: Closes: gh-1' ]]
    ])
  },
  {
    msg: 'Component: short message\n\n' +
         'Closing #1',
    reasons: new Map([
      [jquery0, [ 'Invalid ticket reference, must be /' + jquery0.ticketPattern + '/\nWas: Closing #1' ]],
      [jquery1, [ 'Invalid ticket reference, must be /' + jquery1.ticketPattern + '/\nWas: Closing #1' ]],
      [jquery3, [ 'Invalid ticket reference, must be /' + jquery3.ticketPattern + '/\nWas: Closing #1' ]]
    ])
  },
  {
    msg: 'Component: short message\n\n' +
         'Fixing gh-1',
    reasons: new Map([
      [jquery0, [ 'Invalid ticket reference, must be /' + jquery0.ticketPattern + '/\nWas: Fixing gh-1' ]],
      [jquery1, [ 'Invalid ticket reference, must be /' + jquery1.ticketPattern + '/\nWas: Fixing gh-1' ]],
      [jquery3, [ 'Invalid ticket reference, must be /' + jquery3.ticketPattern + '/\nWas: Fixing gh-1' ]]
    ])
  },
  {
    msg: 'Component: short message\n\n' +
         'Resolving WEB-1',
    reasons: new Map([
      [jquery0, [ 'Invalid ticket reference, must be /' + jquery0.ticketPattern + '/\nWas: Resolving WEB-1' ]],
      [jquery1, [ 'Invalid ticket reference, must be /' + jquery1.ticketPattern + '/\nWas: Resolving WEB-1' ]],
      [jquery3, [ 'Invalid ticket reference, must be /' + jquery3.ticketPattern + '/\nWas: Resolving WEB-1' ]]
    ])
  },
  {
    msg: 'Component: short message\n\n' +
         '# Please enter the commit message . Lines starting\n' +
         "# with '#' will be ignored, an empty message aborts the commit.\n" +
         '# On branch commitplease-rocks\n' +
         '# Changes to be committed:\n' +
         '#	modified:   test.js\n' +
         '# ------------------------ >8 ------------------------\n' +
         '# Do not touch the line above.\n' +
         '# Everything below will be removed.\n' +
         'diff --git a/test.js b/test.js\n' +
         'index c689515..706b86f 100644\n' +
         '--- a/test.js\n' +
         '+++ b/test.js\n' +
         '@@ -1,14 +1,10 @@\n' +
         "var validate = require('./lib/validate')\n" +
         "var sanitize = require('./lib/sanitize')\n"
  },
  {
    msg: 'Component: short message\n\n' +
         'This PR closes #123'
  }
]

var angularOpening =
    'First line must be <type>(<scope>): <subject>\n' +
    'Need an opening parenthesis: ('
var angularOpeningRevert =
    'First line must be revert: <type>(<scope>): <subject>\n' +
    'Need an opening parenthesis: ('
var angularClosing =
    'First line must be <type>(<scope>): <subject>\n' +
    'Need a closing parenthesis after scope: <scope>)'
var angularSpace =
    'First line must be <type>(<scope>): <subject>\n' +
    'Need a space after colon: ": "'
var angularScope =
    'First line must be <type>(<scope>): <subject>\n' +
    'Scope  does not match \\S+.*'
var angularColon =
    'First line must be <type>(<scope>): <subject>\n' +
    'Need a colon after the closing parenthesis: ):'
var angularLowercase =
    '<subject> must start with a lowercase letter'
var angularDot =
    '<subject> must not end with a dot'
var angularIfRevert =
    'If this is a revert of a previous commit, please write:\n' +
    'revert: <type>(<scope>): <subject>'
var angularEmptyTypeRevert =
    'First line must be revert: <type>(<scope>): <subject>\n' +
    '<type> was empty, must be one of these:\n' +
    'feat, fix, docs, style, refactor, perf, test, chore'

var angular0 = defaults.angular

var profiles1 = [angular0]
var messages1 = [
  {
    msg: 'feat(scope): subject'
  },
  {
    msg: 'fix(scope): subject'
  },
  {
    msg: 'docs(scope): subject'
  },
  {
    msg: 'style(scope): subject'
  },
  {
    msg: 'refactor(scope): subject'
  },
  {
    msg: 'perf(scope): subject'
  },
  {
    msg: 'test(scope): subject'
  },
  {
    msg: 'chore(scope): subject'
  },
  {
    msg: 'feat($scope): subject'
  },
  {
    msg: 'feat(guide/location): subject'
  },
  {
    msg: 'feat(scope-scope): subject'
  },
  {
    msg: 'feat(ngCamelCase): subject'
  },
  {
    msg: 'revert: feat(scope): subject'
  },
  {
    msg: 'feat(*): subject'
  },
  {
    msg: 'feat(scope1): docs(scope2):'
  },
  {
    msg: 'feat($scope): subject\n\n' +
         'Closes #1\n' +
         'Closes #123'
  },
  {
    msg: 'feat($scope): subject\n\n' +
         'closes #1\n' +
         'closes #123'
  },
  {
    msg: 'feat($scope): subject\n\n' +
         'Connect #1\n' +
         'Connect to #1\n' +
         'Connects to #1\n' +
         'Connected to #1'
  },
  {
    msg: 'feat($scope): subject\n\n' +
         'connect #1\n' +
         'connect to #1\n' +
         'connects to #1\n' +
         'connected to #1'
  },
  {
    msg: 'feat',
    reasons: new Map([[angular0, [angularOpening]]])
  },
  {
    msg: 'feat subject',
    reasons: new Map([[angular0, [angularOpening]]])
  },
  {
    msg: 'feat: subject',
    reasons: new Map([[angular0, [angularOpening]]])
  },
  {
    msg: 'feat(',
    reasons: new Map([[angular0, [angularClosing]]])
  },
  {
    msg: 'feat()',
    reasons: new Map([[angular0, [angularScope]]])
  },
  {
    msg: 'feat(scope)',
    reasons: new Map([[angular0, [angularColon]]])
  },
  {
    msg: 'feat(scope):',
    reasons: new Map([[angular0, [angularSpace]]])
  },
  {
    msg: 'feat(scope):subject',
    reasons: new Map([[angular0, [angularSpace]]])
  },
  {
    msg: 'feat(scope): Subject',
    reasons: new Map([[angular0, [angularLowercase]]])
  },
  {
    msg: 'feat(scope): subject.',
    reasons: new Map([[angular0, [angularDot]]])
  },
  {
    msg: 'revert this commit',
    reasons: new Map([[angular0, [angularIfRevert]]])
  },
  {
    msg: 'revert(scope): subject',
    reasons: new Map([[angular0, [angularIfRevert]]])
  },
  {
    msg: 'revert: (scope): subject',
    reasons: new Map([[angular0, [angularEmptyTypeRevert]]])
  },
  {
    msg: 'revert: feat: subject',
    reasons: new Map([[angular0, [angularOpeningRevert]]])
  },
  {
    msg: 'revert: subject',
    reasons: new Map([[angular0, [angularOpeningRevert]]])
  },
  {
    msg: 'feat(scope1):docs(scope2): subject',
    reasons: new Map([[angular0, [angularSpace]]])
  }
]

var profiles9 = profiles0.concat(profiles1)
var messages9 = [
  {
    msg: '0.0.1'
  },
  {
    msg: 'v0.0.1'
  },
  {
    msg: '512.4096.65536'
  },
  {
    msg: 'v512.4096.65536'
  },
  {
    msg: "Merge branch 'one' into two"
  },
  {
    msg: 'Merge e8d808b into 0f40453'
  },
  {
    msg: 'fixup!'
  },
  {
    msg: 'fixup! short message'
  },
  {
    msg: 'squash!'
  },
  {
    msg: 'squash! short message'
  },
  {
    msg: '[fix]: short message',
    reasons: new Map([
      [jquery2, [jqueryFixComponent + jquery2.components.join(', ')]],
      [jquery4, [jqueryFixComponent + jquery4.components.join(', ')]],
      [angular0, [angularOpening]]
    ])
  },
  {
    msg: '[Tmp]: short message',
    reasons: new Map([
      [jquery2, [jqueryTmpComponent + jquery2.components.join(', ')]],
      [jquery4, [jqueryTmpComponent + jquery4.components.join(', ')]],
      [angular0, [angularOpening]]
    ])
  },
  {
    msg: '',
    reasons: new Map([
      [jquery0, [jqueryCommitMessageEmpty]],
      [jquery1, [jqueryCommitMessageEmpty]],
      [jquery2, [jqueryCommitMessageEmpty]],
      [jquery3, [jqueryCommitMessageEmpty]],
      [jquery4, [jqueryCommitMessageEmpty]],
      [angular0, ['Commit message is empty, abort with error']]
    ])
  }
]

var groups = new Map([
  [profiles0, messages0],
  [profiles1, messages1],
  [profiles9, messages9]
])

exports.tests = function (test) {
  for (var group of groups) {
    testGroup(test, group)
  }
  test.done()
}

function testGroup (test, group) {
  let [profiles, messages] = [group[0], group[1]]

  for (let profile of profiles) {
    for (let message of messages) {
      let excludes = message.excludes
      if (excludes && excludes.indexOf(profile) !== -1) {
        continue
      }

      let msg = message.msg

      let accepts = message.accepts
      if (accepts && accepts.indexOf(profile) !== -1) {
        let result = validate(sanitize(msg), profile)
        test.deepEqual(result, [], '\n' + msg)

        continue
      }

      let rejects = message.rejects
      if (rejects && rejects.indexOf(profile) !== -1) {
        let result = validate(sanitize(msg), profile)
        test.notDeepEqual(result, [], '\n' + msg)

        continue
      }

      let reasons = message.reasons
      if (reasons && reasons.get(profile)) {
        let reason = reasons.get(profile)

        let result = validate(sanitize(msg), profile)
        test.deepEqual(result, reason, '\n' + msg)

        continue
      }

      // assume default: profile must pass the test
      let result = validate(sanitize(msg), profile)
      test.deepEqual(result, [], '\n' + msg)
    }
  }

  for (let message of messages) {
    let msg = message.msg

    let accepts = message.accepts
    if (accepts) {
      for (let profile of accepts) {
        if (profiles.indexOf(profile) === -1) {
          let result = validate(sanitize(msg), profile)
          test.deepEqual(result, [], '\n' + msg)
        }
      }
    }

    let rejects = message.rejects
    if (rejects) {
      for (let profile of rejects) {
        if (profiles.indexOf(profile) === -1) {
          let result = validate(sanitize(msg), profile)
          test.notDeepEqual(result, [], '\n' + msg)
        }
      }
    }

    let reasons = message.reasons
    if (reasons) {
      for (let key2val of reasons) {
        let [profile, reason] = [key2val[0], key2val[1]]
        if (profiles.indexOf(profile) === -1) {
          let result = validate(sanitize(msg), profile)
          test.deepEqual(result, reason, '\n' + msg)
        }
      }
    }
  }
}
