import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import json from "rollup-plugin-json";
import builtins from "rollup-plugin-node-builtins";
import nodeGlobals from "rollup-plugin-node-globals";
import pegjs from "./pegjs.js";

export default {
	onwarn: ()=>{},
	format: "umd",
	moduleName: "temple_compiler",
	plugins: [
		builtins(),

		resolve({
			jsnext: false,
			main: true,
			browser: true,
			preferBuiltins: true
		}),

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
