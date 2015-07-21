( function avoidSelfInstall() {
	var pkg = require( "./package" ),
		nameRegex = new RegExp( "node_modules/" + pkg.name + "$" );
	if ( !nameRegex.test( process.cwd().replace( /\\/g, "/" ) ) ) {
		console.log( "running install inside self, no need" );
		process.exit( 0 );
	}
}() );

var path = require( "path" );
var fs = require( "fs" );
var root = path.resolve( __dirname, "../.." );
var git = path.resolve( root, ".git" );
var hooks = path.resolve( git, "hooks" );

var rootPackage = require( path.resolve( root, "package" ) );
if ( rootPackage.commitplease && rootPackage.commitplease.nohook ) {
	console.error( "package.json indicates to skip hook" );
	process.exit( 0 );
}

// Check if we are in a git repository so we can bail out early when this is not the case.
if ( !fs.existsSync( git ) || !fs.lstatSync( git ).isDirectory() ) {
	console.error( "Could not find git repo in " + git );
	process.exit( 0 );
}

if ( !fs.existsSync( hooks ) ) {
	fs.mkdirSync( hooks );
}

var hook = path.resolve( hooks, "commit-msg" );
var hookFile = path.relative( path.resolve( hooks ), "./commit-msg-hook.js" );

var context = {
	hook: hook,
	create: function() {
		try {
			fs.writeFileSync( hook, fs.readFileSync( hookFile ) );
			fs.chmodSync( hook, "755" );
		} catch ( e ) {
			if ( /EPERM/.test( e.message ) ) {
				console.error( "Failed to write commit-msg hook. " +
					"Make sure you have the necessary permissions." );
			}
			throw e;
		}
	},
	destroy: function() {
		fs.unlinkSync( hook );
	}
};

if ( fs.existsSync( hook ) ) {
	context.hookExists = true;
	var content = fs.readFileSync( hook, "utf-8" );
	if ( content && content.split( "\n" )[ 1 ] === "// commitplease-original" ) {
		context.selfmadeHook = true;
	}
}

module.exports = context;
