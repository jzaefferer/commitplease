// based on install.js by bahmutov
// https://github.com/bahmutov/pre-git/blob/d755ab63d132464bf5a569044033d24fbcd9f55f/install.js

var pkg = require('./package');
console.log(pkg.name, pkg.version);
console.log("cwd\t\t", process.cwd());
console.log("__dirname\t", __dirname);

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

var name = "commit-msg";
console.log('installing hook', name);

var hook = path.resolve(hooks, name);
var hookContent = fs.readFileSync( "./commit-msg-hook.js" );

// If there's an existing `pre-commit` hook we want to back it up instead of
// overriding it and losing it completely
if (fs.existsSync(hook)) {
	console.log('');
	console.log(name + ': Detected an existing git hook');
	fs.writeFileSync(hook + '.old', fs.readFileSync(hook));
	console.log(name + ': Old hook backuped to .old');
	console.log('');
}

// Everything is ready for the installation of the pre-commit hook. Write it and
// make it executable.
fs.writeFileSync(hook, hookContent);
fs.chmodSync(hook, '755');
