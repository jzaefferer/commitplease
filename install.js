// based on install.js by bahmutov
// https://github.com/bahmutov/pre-git/blob/d755ab63d132464bf5a569044033d24fbcd9f55f/install.js

var pkg = require('./package');
console.log(pkg.name, pkg.version);

(function avoidSelfInstall() {
	var nameRegex = new RegExp('node_modules/' + pkg.name + '$');
	if (!nameRegex.test(process.cwd())) {
		console.log('running install inside self, no need');
		process.exit(0);
	}
}());

var path = require('path');
var fs = require('fs');
var root = path.resolve(__dirname, '../..');
var git = path.resolve(root, '.git');
var hooks = path.resolve(git, 'hooks');

// Check if we are in a git repository so we can bail out early when this is not the case.
if (!fs.existsSync(git) || !fs.lstatSync(git).isDirectory()) {
	console.error('Could not find git repo in ' + git);
	process.exit(0);
}

if (!fs.existsSync(hooks)) {
	fs.mkdirSync(hooks);
}

var hook = path.resolve(hooks, "commit-msg");
var symlink = path.relative(path.resolve(hooks), "./commit-msg-hook.js");

// Check for existing hook
if ( fs.existsSync( hook ) ) {
	var stats = fs.lstatSync( hook );
	if ( stats.isSymbolicLink() && fs.readlinkSync( hook ) === symlink ) {
		console.log( "Found the correct existing symlink, doing nothing" );
		process.exit(0);
	}
	console.log('Detected an existing git commit-msg hook');
	console.log('');
	console.log('Remove it and install this package again to install the symlink');
	process.exit(0);
}

fs.symlinkSync(symlink, hook);
