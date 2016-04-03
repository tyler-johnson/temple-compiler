import minimist from "minimist";
import {resolve} from "path";

const myApp = require("./");

let argv = minimist(process.argv.slice(2), {
	string: [ "config" ],
	boolean: [ "help", "version" ],
	alias: {
		h: "help", H: "help",
		v: "version", V: "version",
		c: "config"
	}
});

if (argv.help) {
	console.log(`halp plz`);
	process.exit(0);
}

if (argv.version) {
	let {name, version="edge"} = require("./package.json");
	console.log("%s %s", name, version);
	process.exit(0);
}

if (argv.config) {
	try {
		merge(argv, require(resolve(argv.config)));
	} catch(e) {
		if (!/Cannot find module/.test(e.message)) throw e;
	}
}

function panic(e) {
	console.error(e.stack || e);
	process.exit(1);
}

myApp();
