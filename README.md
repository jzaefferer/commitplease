# Commitplease

[![Build Status](https://secure.travis-ci.org/jzaefferer/commitplease.png)](http://travis-ci.org/jzaefferer/commitplease)

This [node.js](http://nodejs.org/) module validates git commit messages while you commit.

## Installation

```js
npm install commitplease
```

## Usage

Just commit as usual. This modules installs a git commit-msg hook, automatically validating all commit messages as you enter them. Invalid messages will be rejected, with details on what's wrong and a copy of the input.

## API

*The API is a work-in-progress. Currently there's no way to customize options when using the bundled commit hook.*

```js
var validate = require('commitplease/lib/validate');
var errors = commitplease(commit.message);
if (errors.length) {
	postComment('This commit has ' errors.length + ' problems!');
}
```

`validate(message[, options])`, returns `Array`

* `message` (`String`): The commit message to validate. Must use LF (`\n`) as line breaks.
* `options` (`Object`, optional): Use this to override the default settings, see properties and defaults below
* returns `Array`: Empty for valid messages, one or more items as `String` for each problem found



Options and their defaults:

```js
// component in subject is required
component: true,
limits: {
	// hard limit of subject
	subject: 50,
	// hard limit of all other lines
	other: 72
}
```

## License
Copyright 2014 Jörn Zaefferer. Released under the terms of the MIT license.

---

Support this project by [donating on Gittip](https://www.gittip.com/jzaefferer/).