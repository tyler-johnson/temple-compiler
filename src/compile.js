import parse from "./parse";

const smfurl = "sourceMappingURL=";
const datauri = "data:application/json;charset=utf-8;base64,";

var toBase64;
if (typeof window !== "undefined" && typeof window.btoa === "function") {
	toBase64 = window.btoa;
} else toBase64 = function(str) {
	return new Buffer(str, "utf-8").toString("base64");
};

function srcToString(smf) {
	return this.code + "\n\n//# " + smfurl +
		(typeof smf === "string" ? smf :
			datauri + toBase64(this.map.toString()));
}

export default function compile(src, options={}) {
	let ast = parse(src, options);
	let out = ast.compile(options).toStringWithSourceMap();
	out.ast = ast;
	out.toString = srcToString;
	return out;
}
