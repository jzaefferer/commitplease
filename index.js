var fs = require( "fs" ),
	path = require( "path" ),
	root = path.resolve( __dirname, "../.." ),
	chalk = require( "chalk" ),
	validate = require( "./lib/validate" ),
	options = fs.existsSync( path.join( root, "package.json" ) ) &&
		require( path.join( root, "package.json" ) ).commitplease || {};

module.exports = function( messageFile ) {
	var message = fs.readFileSync( messageFile ).toString(),
		errors = validate( message, options ),
		scissor = /# ------------------------ >8 ------------------------[\s\S]+/;
	if ( errors.length ) {
		console.error( "Invalid commit message, please fix the following issues:\n" );
		console.error( chalk.red( "- " + errors.join( "\n- " ) ) );
		console.error();
		console.error( "Commit message was:");
		console.error();
		console.error( chalk.green( message.replace(scissor, "") ) );
		process.exit( 1 );
	}
};
