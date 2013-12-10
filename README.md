# Commitplease

[![Build Status](https://secure.travis-ci.org/jzaefferer/commitplease.png)](http://travis-ci.org/jzaefferer/commitplease)

This [node.js](http://nodejs.org/) module takes a string, validates it as a commit message and returns
a list of problems.

## Installation

```js
npm install commitplease
```

## Usage

```js
var commitplease = require('commitplease');
var errors = commitplease(commit.message);
if (errors.length) {
	postComment('This commit has ' errors.length + ' problems!');
}
```

## API

`commitplease(message[, options])`, returns `Array`

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
Copyright 2013 Jörn Zaefferer. Released under the terms of the MIT license.

---

Support this project by [donating on Gittip](https://www.gittip.com/jzaefferer/).