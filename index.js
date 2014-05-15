var fs = require( "fs" ),
	chalk = require( "chalk" ),
	validate = require( "./lib/validate" );
module.exports = function( messageFile ) {
	var message = fs.readFileSync( messageFile ).toString();
	var errors = validate( message );
	if ( errors.length ) {
		console.error( "Invalid commit message, please fix the following issues:\n" );
		console.error( chalk.red( "- " + errors.join( "\n- " ) ) );
		console.error();
		console.error( "Commit message was:");
		console.error();
		console.error( chalk.green( message ) );
		process.exit( 1 );
	}
};
