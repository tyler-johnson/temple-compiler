import Node from "./node";
import {header,containsEntities} from "./utils";

export default class Text extends Node {
	get reactive() { return false; }

	compile(data) {
		this.start(data);

		var value = this.value.replace(/\s+/g, " ");
		var safe = JSON.stringify(value);

		if (containsEntities(value)) {
			safe = `Temple.utils.decodeEntities(${safe})`;
		}

		header(data, "var idom = Temple.idom;\n");
		this.write(`idom.text(${safe});`);
		return this.end();
	}
}
