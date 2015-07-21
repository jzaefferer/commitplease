var chalk = require( "chalk" ),
	setup = require( "./setup" );

if ( setup.selfmadeHook ) {
	console.log( "Found an existing commitplease hook, removing to update it" );
	setup.destroy();
} else if ( setup.hookExists ) {
	console.log( chalk.red( "Detected an existing git commit-msg hook" ) );
	console.log( "" );
	console.log( chalk.red( "Remove it and install this package again to install commitplease properly" ) );
	process.exit( 0 );
}

setup.create();
console.log( "Installed " + setup.hook );
