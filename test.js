var validate = require( "./lib/validate" );

var valid = [
	{
		msg: "Component: short message"
	},
	{
		msg: "Component: short message\n" +
		"\n" +
		"Long description"
	},
	{
		msg: "Component: short message\n" +
		"\n" +
		"Long description\n" +
		"\n" +
		"Closes #123"
	},
	{
		msg: "Component: short message\n" +
		"\n" +
		"Closes jquery/jquery-mobile#123"
	},
	{
		msg: "short message",
		options: {
			component: false
		}
	},
	{
		msg: "Component: message over default of 50 but below limit off 70",
		options: {
			limits: {
				subject: 70
			}
		}
	},
	{
		msg: "Component: short message\n" +
		"\n" +
		"# Long comment that has to be ignored line too long beyond 72 chars line too long beyond" +
			"line too long line too long line too long"
	},
	{
		msg: "v1.13.0"
	},
	{
		msg: "0.0.1"
	},
	{
		msg: "Component: Message\n#comment"
	},
	{
		msg: "Component: short message\n" +
		"\n" +
		"Fixes some bug.\n" +
		"Fix some other bug.\n" +
		"\n" +
		"Fixes #123"
	},
	{
		msg: "Component: short message\n" +
		"\n" +
		"Fix some bug.\n" +
		"\n" +
		"Fixes #123"
	},
	{
		msg: "Merge branch 'one' into two"
	}
];

var invalid = [
	{
		msg: "Component: short message but actually a little bit over default character limit",
		expected: [ "First line (subject) must be no longer than 72 characters" ]
	},
	{
		msg: "foo:",
		expected: [ "First line (subject) must have a message after the component" ]
	},
	{
		msg: "no component here",
		expected: [ "First line (subject) must indicate the component" ]
	},
	{
		msg: "component: bla\ntext on next line",
		expected: [ "Second line must always be empty" ]
	},
	{
		msg: "component: bla\n\nline too long beyond 80 chars line too long beyond" +
			"line too long line too long line too long",
		expected: [ "Commit message line 3 too long: 91 characters, only 80 allowed. Was: line too long beyond[...]" ]
	},
	{
		msg: "Docs: Fix a typo\n\nCloses: gh-155",
		expected: [ "Invalid ticket reference, must be /(Fixes|Closes) (.*#|gh-)[0-9]+/, was: Closes: gh-155" ]
	},
	{
		msg: "Bla: blub\n\nClosing #1",
		expected: [ "Invalid ticket reference, must be /(Fixes|Closes) (.*#|gh-)[0-9]+/, was: Closing #1" ]
	},
	{
		msg: "Bla: blub\n\nFixing gh-1",
		expected: [ "Invalid ticket reference, must be /(Fixes|Closes) (.*#|gh-)[0-9]+/, was: Fixing gh-1" ]
	},
	{
		msg: "Bla: blub\n\nResolving xy-9991",
		expected: [ "Invalid ticket reference, must be /(Fixes|Closes) (.*#|gh-)[0-9]+/, was: Resolving xy-9991" ]
	}
];

exports.valid = function( test ) {
	valid.forEach(function(check, index) {
		test.deepEqual( validate( check.msg, check.options ), [], "valid " + index +
			" " + check.msg );
	});
	test.done();
};

exports.invalid = function( test ) {
	invalid.forEach(function(check, index) {
		test.deepEqual( validate( check.msg, check.options ), check.expected,
			"invalid " + index + " " + check.msg );
	});
	test.done();
};
