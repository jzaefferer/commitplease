require( "colors" );
var fs = require( "fs" ),
	validate = require( "./lib/validate" );
module.exports = function( messageFile ) {
	var message = fs.readFileSync( messageFile ).toString();
	var errors = validate( message );
	if ( errors.length ) {
		console.error( "Invalid commit message, please fix the following issues:\n" );
		console.error( "- " + errors.join( "\n- " ).red );
		console.error();
		console.error( "Commit message was:");
		console.error();
		console.error( message.green );
		process.exit( 1 );
	}
};
