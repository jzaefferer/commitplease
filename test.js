var merge = require('mout/object/merge')
var validate = require('./lib/validate')
var sanitize = require('./lib/sanitize')

var profile0 = validate.defaults
var profile1 = merge(validate.defaults, {component: false})
var profile2 = merge(validate.defaults, {components: ['Build', 'Legacy']})

var profile3 = merge(
  validate.defaults, {
    ticketPattern: '^(Closes|Fixes) ([a-zA-Z]{2,}-)[0-9]+'
  }
)

var profiles0 = [profile0, profile1, profile3]

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
    msg: 'Component: short message\n' +
         'text on next line',
    reasons: new Map([
      [profile0, [ 'Second line must always be empty' ]],
      [profile1, [ 'Second line must always be empty' ]],
      [profile3, [ 'Second line must always be empty' ]]
    ])
  },
  {
    msg: 'No component here, short message',
    accepts: [profile1],
    reasons: new Map([
      [profile0, ['First line (subject) must indicate the component']],
      [profile3, ['First line (subject) must indicate the component']]
    ])
  },
  {
    msg: 'Build: short message',
    accepts: [profile2]
  },
  {
    msg: 'Test: short message',
    reasons: new Map([
      [profile2, ["Component invalid, was 'Test', must be one of these: Build, Legacy"]]
    ])
  },
  {
    msg: 'Component: short message\n' +
         '# Long comments still have to be ignored' +
         'even though they are longer than 72 characters' +
         'notice the absense of newline character in test'
  },
  {
    msg: 'Component: short message but actually a little bit over default character limit',
    reasons: new Map([
      [profile0, [ 'First line (subject) must be no longer than 72 characters' ]],
      [profile1, [ 'First line (subject) must be no longer than 72 characters' ]],
      [profile2, [
        'First line (subject) must be no longer than 72 characters',
        "Component invalid, was 'Component', must be one of these: Build, Legacy"
      ]],
      [profile3, [ 'First line (subject) must be no longer than 72 characters' ]]
    ])
  },
  {
    msg: 'Component: short message\n\n' +
         'Long description is way past the 80 characters limit' +
         'Long description is way past the 80 characters limit',
    reasons: new Map([
      [profile0, [ 'Commit message line 3 too long: 104 characters, only 80 allowed. Was: Long description is [...]' ]],
      [profile1, [ 'Commit message line 3 too long: 104 characters, only 80 allowed. Was: Long description is [...]' ]],
      [profile3, [ 'Commit message line 3 too long: 104 characters, only 80 allowed. Was: Long description is [...]' ]]
    ])
  },
  {
    msg: 'Build:',
    accepts: [profile1],
    reasons: new Map([
      [profile0, [ 'First line (subject) must have a message after the component' ]],
      [profile2, [
        "Component invalid, was 'Build:', must be one of these: Build, Legacy",
        'First line (subject) must have a message after the component'
      ]],
      [profile3, [ 'First line (subject) must have a message after the component' ]]
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
      [profile3, [
        'Invalid ticket reference, must be /' + profile3.ticketPattern + '/, was: Fixes #1',
        'Invalid ticket reference, must be /' + profile3.ticketPattern + '/, was: Fixes #123'
      ]]
    ])
  },
  {
    msg: 'Component: short message\n\n' +
         'Fixes #1 Fixes #123',
    reasons: new Map([
      [profile3, [
        'Invalid ticket reference, must be /' + profile3.ticketPattern + '/, was: Fixes #1 Fixes #123'
      ]]
    ])
  },
  {
    msg: 'Component: short message\n\n' +
         'Fixes jquery/jquery#1\n' +
         'Fixes jquery/jquery#123',
    reasons: new Map([
      [profile3, [
        'Invalid ticket reference, must be /' + profile3.ticketPattern + '/, was: Fixes jquery/jquery#1',
        'Invalid ticket reference, must be /' + profile3.ticketPattern + '/, was: Fixes jquery/jquery#123'
      ]]
    ])
  },
  {
    msg: 'Component: short message\n\n' +
         'Fixes jquery/jquery#1 Fixes jquery/jquery#123',
    reasons: new Map([
      [profile3, [
        'Invalid ticket reference, must be /' + profile3.ticketPattern + '/, was: Fixes jquery/jquery#1 Fixes jquery/jquery#123'
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
      [profile3, [
        'Invalid ticket reference, must be /' + profile3.ticketPattern + '/, was: Closes #1',
        'Invalid ticket reference, must be /' + profile3.ticketPattern + '/, was: Closes #123'
      ]]
    ])
  },
  {
    msg: 'Component: short message\n\n' +
         'Closes #1 Closes #123',
    reasons: new Map([
      [profile3, [
        'Invalid ticket reference, must be /' + profile3.ticketPattern + '/, was: Closes #1 Closes #123'
      ]]
    ])
  },
  {
    msg: 'Component: short message\n\n' +
         'Closes jquery/jquery#1\n' +
         'Closes jquery/jquery#123',
    reasons: new Map([
      [profile3, [
        'Invalid ticket reference, must be /' + profile3.ticketPattern + '/, was: Closes jquery/jquery#1',
        'Invalid ticket reference, must be /' + profile3.ticketPattern + '/, was: Closes jquery/jquery#123'
      ]]
    ])
  },
  {
    msg: 'Component: short message\n\n' +
         'Closes jquery/jquery#1 Closes jquery/jquery#123',
    reasons: new Map([
      [profile3, [
        'Invalid ticket reference, must be /' + profile3.ticketPattern + '/, was: Closes jquery/jquery#1 Closes jquery/jquery#123'
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
         'Fixes #123\n' +
         'Fixes #1 Fixes #123\n' +
         'Fixes gh-123\n' +
         'Fixes gh-1 Fixes gh-123\n' +
         'Fixes WEB-123\n' +
         'Fixes WEB-1 Fixes WEB-123\n' +
         'Fixes CRM-123\n' +
         'Fixes CRM-1 Fixes CRM-123\n',
    rejects: [profile3]
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
    rejects: [profile3]
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
    rejects: [profile3]
  },
  {
    msg: 'Component: short message\n\n' +
         'Long description\n\n' +
         'Closes #42\n\n' +
         'An afterthought is ok',
    reasons: new Map([
      [profile3, [ 'Invalid ticket reference, must be /' + profile3.ticketPattern + '/, was: Closes #42' ]]
    ])
  },
  {
    msg: 'Component: short message\n\n' +
         'Closes: gh-1',
    reasons: new Map([
      [profile0, [ 'Invalid ticket reference, must be /' + profile0.ticketPattern + '/, was: Closes: gh-1' ]],
      [profile1, [ 'Invalid ticket reference, must be /' + profile1.ticketPattern + '/, was: Closes: gh-1' ]],
      [profile3, [ 'Invalid ticket reference, must be /' + profile3.ticketPattern + '/, was: Closes: gh-1' ]]
    ])
  },
  {
    msg: 'Component: short message\n\n' +
         'Closing #1',
    reasons: new Map([
      [profile0, [ 'Invalid ticket reference, must be /' + profile0.ticketPattern + '/, was: Closing #1' ]],
      [profile1, [ 'Invalid ticket reference, must be /' + profile1.ticketPattern + '/, was: Closing #1' ]],
      [profile3, [ 'Invalid ticket reference, must be /' + profile3.ticketPattern + '/, was: Closing #1' ]]
    ])
  },
  {
    msg: 'Component: short message\n\n' +
         'Fixing gh-1',
    reasons: new Map([
      [profile0, [ 'Invalid ticket reference, must be /' + profile0.ticketPattern + '/, was: Fixing gh-1' ]],
      [profile1, [ 'Invalid ticket reference, must be /' + profile1.ticketPattern + '/, was: Fixing gh-1' ]],
      [profile3, [ 'Invalid ticket reference, must be /' + profile3.ticketPattern + '/, was: Fixing gh-1' ]]
    ])
  },
  {
    msg: 'Component: short message\n\n' +
         'Resolving WEB-1',
    reasons: new Map([
      [profile0, [ 'Invalid ticket reference, must be /' + profile0.ticketPattern + '/, was: Resolving WEB-1' ]],
      [profile1, [ 'Invalid ticket reference, must be /' + profile1.ticketPattern + '/, was: Resolving WEB-1' ]],
      [profile3, [ 'Invalid ticket reference, must be /' + profile3.ticketPattern + '/, was: Resolving WEB-1' ]]
    ])
  },
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
    msg: '[fix]: short message'
  },
  {
    msg: '[Tmp]: short message'
  },
  {
    msg: '',
    reasons: new Map([
      [profile0, [
        'First line (subject) must not be empty',
        'First line (subject) must indicate the component',
        'First line (subject) must have a message after the component'
      ]],
      [profile1, [ 'First line (subject) must not be empty' ]],
      [profile2, [
        'First line (subject) must not be empty',
        'First line (subject) must indicate the component',
        'First line (subject) must have a message after the component'
      ]],
      [profile3, [
        'First line (subject) must not be empty',
        'First line (subject) must indicate the component',
        'First line (subject) must have a message after the component'
      ]]
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
  }
]

// reserve for Angular
var profiles1 = []
var messages1 = []

var groups = new Map([
  [profiles0, messages0],
  [profiles1, messages1]
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
