import babel from "rollup-plugin-babel";
import json from "rollup-plugin-json";
import pegjs from "./pegjs.js";
import resolve from "rollup-plugin-node-resolve";

const rel_regex = /^\.{1,2}$|^\.{0,2}\//;
const _resolve = resolve({
	jsnext: false,
	main: true,
	browser: true,
	preferBuiltins: true
});

export default {
	onwarn: ()=>{},
	format: "cjs",
	plugins: [
		{
			resolveId: function(id) {
				if (!rel_regex.test(id)) return;
				return _resolve.resolveId.apply(this, arguments);
			}
		},
		pegjs(),
		json(),
		babel({
			exclude: [ "node_modules/**" ],
			include: [ "src/**" ],
			presets: [ "es2015-rollup" ],
			plugins: [
				"transform-object-rest-spread",
				"lodash"
			]
		})
	]
};
