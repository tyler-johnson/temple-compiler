import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import json from "rollup-plugin-json";
import builtins from "rollup-plugin-node-builtins";
import nodeGlobals from "rollup-plugin-node-globals";
import pegjs from "./pegjs.js";

const _resolve = resolve({
	jsnext: false,
	main: true,
	browser: true,
	preferBuiltins: true
});

export default {
	onwarn: ()=>{},
	format: "umd",
	moduleName: "Temple",
	globals: {
		"templejs-runtime": "Temple"
	},
	plugins: [
		builtins(),

		{
			resolveId: function(id) {
				if (id === "templejs-runtime") return false;
				return _resolve.resolveId.apply(null, arguments);
			}
		},

		pegjs(),

		json(),

		commonjs({
			include: [ "node_modules/**" ],
			exclude: [ "src/**", "node_modules/rollup-plugin-node-globals/**" ],
			extensions: [ ".js" ]
		}),

		babel({
			exclude: [ "node_modules/**" ],
			include: [ "src/**" ],
			presets: [ "es2015-rollup" ],
			plugins: [
				"transform-object-rest-spread",
				"lodash"
			]
		}),

		nodeGlobals()
	]
};
