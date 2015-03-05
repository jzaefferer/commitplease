var merge = require( "mout/object/merge" ),
	semver = require( "semver"),
	subjectExceptions = /^(fixup|squash)!|^\[[^\]]+\]:/,
	defaults = {
		component: true,
		components: [],
		limits: {
			subject: 72,
			other: 80
		}
	};

module.exports = function( message, options ) {
	options = merge( defaults, options );

	var errors = [];

	// Can't cancel forEach, so abuse every to stop at first comment
	message.split( /\n/ ).every(function( line, index ) {
		if ( index === 0 ) {
			// Allow tag commits
			if ( semver.valid( line ) ) {
				return;
			}
			// Allow merge commits
			if ( /^Merge branch/.test( line ) || /^Merge [0-9a-f]+ into [0-9a-f]+/.test( line ) ) {
				return;
			}
			if ( 0 === line.length ) {
				errors.push( "First line (subject) must not be empty" );
			}
			if ( line.length > options.limits.subject ) {
				errors.push( "First line (subject) must be no longer than " +
					options.limits.subject + " characters" );
			}

			if ( !subjectExceptions.test( line ) ) {
				if ( options.component && line.indexOf( ":" ) < 1 ) {
					errors.push( "First line (subject) must indicate the component" );
				}
				var matchedComponent = line.replace( /:.+/, "" );
				if ( options.components.length && matchedComponent &&
						options.components.indexOf( matchedComponent ) === -1 ) {
					errors.push( "Component invalid, was '" + matchedComponent +
						"', must be one of these: " + options.components.join( ", " ) );
				}
				if ( options.component && line.substring( line.indexOf( ":" ) + 1 ).length < 1 ) {
					errors.push( "First line (subject) must have a message after the component" );
				}
			}

		}
		if ( index === 1 && line.length > 0 ) {
			errors.push( "Second line must always be empty" );
		}
		if ( index > 1 && line.length > options.limits.other ) {
			errors.push( "Commit message line " + ( index + 1 ) + " too long: " +
				line.length + " characters, only " + options.limits.other +
				" allowed. Was: " + line.substring( 0, 20 ) + "[...]" );
		}
		// Ticket references
		if ( /^(clos|fix|resolv)(e[sd]|ing)/i.test( line ) ) {
			if ( !/^(Fixes|Closes)\s+[^\s\d]+(\s|$)/.test( line ) &&
					!/^(Fixes|Closes) (.*#|gh-)[0-9]+/.test( line ) ) {
				errors.push( "Invalid ticket reference, must be " +
					"/(Fixes|Closes) (.*#|gh-)[0-9]+/, was: " + line );
			}
		}
		return true;
	});

	return errors;
};
