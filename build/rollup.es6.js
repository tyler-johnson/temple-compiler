import json from "rollup-plugin-json";
import pegjs from "./pegjs.js";

export default {
	onwarn: ()=>{},
	format: "es6",
	plugins: [
		pegjs(),
		json()
	]
};
