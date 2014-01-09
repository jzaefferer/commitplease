#!/usr/bin/env node
require( "colors" );
var fs = require( "fs" );
var commitplease = require( "commitplease" );
var message = fs.readFileSync( process.argv[ 2 ] ).toString();
var errors = commitplease( message );
if ( errors ) {
	console.error( "Invalid commit message, please fix the following issues:\n" );
	console.error( "- " + errors.join( "\n- " ).red );
	console.error();
	console.error( "Commit message was:");
	console.error();
	console.error( message.green );
	process.exit( 1 );
}