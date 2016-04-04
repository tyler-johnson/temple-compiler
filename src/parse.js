import {parse as baseParse} from "./temple.pegjs";

export default function parse(src, options={}) {
	try {
		return baseParse(src, options);
	} catch(e) {
		e.filename = options.filename;
		e.source = src;
		throw e;
	}
}
