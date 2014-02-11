(function avoidSelfInstall() {
	var pkg = require('./package'),
		nameRegex = new RegExp('node_modules/' + pkg.name + '$');
	if (!nameRegex.test(process.cwd().replace(/\\/g, '/'))) {
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

var context = {
	hook: hook,
	createLink: function() {
		try {
			fs.symlinkSync( symlink, hook );
		} catch(e) {
			if (/EPERM/.test(e.message)) {
				console.error("Failed to create symlink. If you're running this on Windows, make sure you execute this as admin");
			}
			throw e;
		}
	},
	destroyLink: function() {
		fs.unlinkSync( hook );
	}
};

if ( fs.existsSync( hook ) ) {
	context.hookExits = true;
	var stats = fs.lstatSync( hook );
	if ( stats.isSymbolicLink() && fs.readlinkSync( hook ) === symlink ) {
		context.selfmadeHook = true;
	}
}

module.exports = context;
