# Commitplease

[![Build Status](https://secure.travis-ci.org/jzaefferer/commitplease.png)](http://travis-ci.org/jzaefferer/commitplease)

This [node.js](http://nodejs.org/) module validates git commit messages while you commit, according to the rules specified in the [jQuery Commit Guidlines](http://contribute.jquery.org/commits-and-pull-requests/#commit-guidelines). These are pretty generic, so this module should be useful for most projects that care about commit message formats.

## Installation

```js
npm install commitplease
```

A git version of 1.8.5 or newer is recommended. If you use `git commit --verbose`, it is required.

## Usage

Just commit as usual. This modules installs a git commit-msg hook, automatically validating all commit messages as you enter them. Invalid messages will be rejected, with details on what's wrong and a copy of the input.

## API

*The API is a work-in-progress*

```js
var validate = require('commitplease/lib/validate');
var errors = validate(commit.message);
if (errors.length) {
	postComment('This commit has ' + errors.length + ' problems!');
}
```

`validate(message[, options])`, returns `Array`

* `message` (`String`): The commit message to validate. Must use LF (`\n`) as line breaks.
* `options` (`Object`, optional): Use this to override the default settings, see properties and defaults below
* returns `Array`: Empty for valid messages, one or more items as `String` for each problem found


Options and their defaults:

```js
component: true,
limits: {
	subject: 72,
	other: 80
}
```

### Customizing the bundled options

The validation options can be overriden by configuring the `commitplease` property on your own project's `package.json`. This allows you to customize some of the validation rules available.

Here's an example for disabling the `component` message validation:

```json
{
  "name": "Example",
  "description": "An example project with custom commit hook options",
  "devDependencies": {
    "commitplease": "1.9.x"
  },
  "commitplease": {
    "component": false
  }
}
```


## License
Copyright 2014 Jörn Zaefferer. Released under the terms of the MIT license.

---

Support this project by [donating on Gittip](https://www.gittip.com/jzaefferer/).