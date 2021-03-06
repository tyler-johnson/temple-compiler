import {assign,pick} from "lodash";
import { SourceNode } from "source-map";

export default class ASTNode {
	constructor(line, col, props) {
		if (typeof line === "object" && col == null && props == null) {
			[props,line] = [line,null];
		}

		this._line = typeof line === "number" ? line : 0;
		this._column =  typeof col === "number" ? col : 0;
		assign(this, props);
	}

	_sn(file, chunk) {
		return new SourceNode(this._line, this._column, file, chunk);
	}

	start(data) {
		this._writer = {
			chunks: [],
			data: data
		};

		return this;
	}

	_normalize_indent() {
		let d = this._writer.data;
		if (typeof d.indent === "string") d.tabchar = d.indent;
		if (d.indent !== false && typeof d.indent !== "number") d.indent = 0;
	}

	indent() {
		this._normalize_indent();
		let d = this._writer.data;
		if (typeof d.indent === "number") d.indent++;
		return this;
	}

	outdent() {
		this._normalize_indent();
		let d = this._writer.data;
		if (typeof d.indent === "number" && d.indent > 0) d.indent--;
		return this;
	}

	tabs() {
		this._normalize_indent();

		let res = "";
		let d = this._writer.data;
		let tabchar = d.tabchar;
		if (tabchar == null) tabchar = "  ";

		if (typeof d.indent === "number") {
			for (let i = 0; i < d.indent; i++) res += tabchar;
		}

		return res;
	}

	write(chunk) {
		this.push([].concat(this.tabs(), chunk, "\n"));
		return this;
	}

	push(chunk) {
		this._writer.chunks.push(chunk);
		return this;
	}

	prepend(chunk) {
		this._writer.chunks.prepend(chunk);
		return this;
	}

	end(chunk) {
		if (chunk) this.write(chunk);
		var w = this._writer;
		delete this._writer;
		return this._sn(w.data.filename, w.chunks);
	}

	compile() {
		throw new Error("Not implemented.");
		// return this._sn(data.filename);
	}

	toJSON() {
		let out = {};
		Object.keys(this).forEach((k) => {
			if (k[0] === "_") return;
			out[k] = this[k];
		});
		assign(out, pick(this, "_line", "_column"));
	}
}
