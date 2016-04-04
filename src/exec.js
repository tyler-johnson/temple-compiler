import compile from "./compile";
import TempleRuntime from "templejs-runtime";
import {merge} from "lodash";

export default function exec(tpl, options) {
	let res = compile(tpl, merge({
		format: "iife"
	}, options));

	return (new Function("Temple", "return " + res.code))(TempleRuntime);
}
