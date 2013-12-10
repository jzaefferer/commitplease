var commitplease = require( "./index" );

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
		"Close #xxx"
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
	}
];

var invalid = [
	{
		msg: "Component: short message but actually over default limit",
		expected: [ "First line (subject) must be no longer than 50 characters" ]
	},
	{
		msg: "no component here",
		expected: [ "First line (subject) must indicate the component (or subsystem)" ]
	},
	{
		msg: "component: bla\ntext on next line",
		expected: [ "Second line must always be empty" ]
	},
	{
		msg: "component: bla\n\nline too long beyond 72 chars line too long beyond" +
			"line too long line too long line too long",
		expected: [ "Commit message line 2 too long: 91 characters, only 72 allowed. Was: line too long beyond[...]" ]
	}
];

exports.valid = function( test ) {
	valid.forEach(function(check, index) {
		test.deepEqual( commitplease( check.msg, check.options ), [], "valid " + index +
			" " + check.msg );
	});
	test.done();
};

exports.invalid = function( test ) {
	invalid.forEach(function(check, index) {
		test.deepEqual( commitplease( check.msg, check.options ), check.expected,
			"invalid " + index + " " + check.msg );
	});
	test.done();
};
