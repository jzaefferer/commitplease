var setup = require( "./setup" );

if ( setup.selfmadeHook ) {
	console.log( "Found the correct existing symlink, doing nothing" );
	process.exit(0);
}

if ( setup.hookExists ) {
	console.log('Detected an existing git commit-msg hook');
	console.log('');
	console.log('Remove it and install this package again to install the symlink');
	process.exit(0);
}

setup.createLink();
console.log( "Installed " + setup.hook );
