var setup = require( "./setup" );

if ( setup.selfmadeHook ) {
	console.log( "Found a hook installed by commitplease, removing" );
	setup.destroy();
} else {
	console.log( "Didn't find a commit-msg hook installed by this module, doing nothing" );
}
