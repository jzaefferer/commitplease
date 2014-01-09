var setup = require( "./setup" );

console.log( "Trying to remove git commit-msg symlink" );

if ( setup.selfmadeHook ) {
	console.log( "Found the correct existing symlink, removing" );
	setup.destroyLink();
	process.exit(0);
}

console.log( "Didn't find a symlink installed by this module, doing nothing" );