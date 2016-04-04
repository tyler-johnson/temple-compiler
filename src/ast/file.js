import {map,invokeMap,assign,uniqueId} from "lodash";
import Node from "./node";

export default class File extends Node {
	compile(data) {
		data = assign({
			format: "es6"
		}, data, {
			filename: this.filename || (uniqueId("template") + ".html"),
			headers: []
		});

		this.start(data);

		let globals = data.globals || { templejs: "Temple" };
		let globalVars = (fn) => {
			return map(globals, (v, id) => {
				return fn(JSON.stringify(id), v);
			});
		};

		let moduleName = typeof data.moduleName === "string" && data.moduleName ? data.moduleName : "";

		switch(data.format) {
			case "es6": {
				this.write(globalVars((id, v) => `import ${v} from ${id};`).join("\n"));
				this.write(`const Template = {};`);
				break;
			}

			case "cjs": {
				this.write(globalVars((id, v) => `var ${v} = require(${id});`).join("\n"));
				this.write(`var Template = module.exports;`);
				break;
			}

			case "umd": {
				this.write(`(function (global, factory) {`).indent();
				this.write(`if (typeof exports === 'object' && typeof module !== 'undefined') {`).indent();
				this.write(`module.exports = factory(${globalVars((id) => `require(${id})`).join(", ")});`);
				this.outdent().write(`} else if (typeof define === 'function' && define.amd) {`).indent();
				let moduleId = typeof data.moduleId === "string" && data.moduleId ? JSON.stringify(data.moduleId) + ", " : "";
				this.write(`define(${moduleId}[${globalVars((id) => `${id}`).join(", ")}], factory);`);
				this.outdent().write(`} else {`).indent();
				this.write(`${moduleName ? "global." + moduleName + " = " : ""}factory(${globalVars((id, v) => `global.${v}`).join(", ")});`);
				this.outdent().write(`}`);
				this.outdent().write(`}(this, function(${globalVars((id, v) => `${v}`).join(", ")}) {`).indent();
				this.write(`var Template = {};`);
				break;
			}

			case "iife": {
				this.write(`${moduleName ? "var " + moduleName + " = " : ""}(function(${globalVars((id, v) => `${v}`).join(", ")}) {`).indent();
				this.write(`var Template = {};`);
				break;
			}
		}

		let children = invokeMap(this.children, "compile", data);
		if (data.headers.length) {
			this.write(this._sn(data.filename, data.headers).join("\n"));
		}
		this.push(children);

		switch(data.format) {
			case "es6":
				this.write("export default Template;");
				break;

			case "umd":
				this.write("return Template;");
				this.outdent().write(`}));`);
				break;

			case "iife":
				this.write("return Template;");
				this.outdent().write(`}(${globalVars((id, v) => `${v}`).join(", ")}));`);
				break;
		}

		let source = this.end();
		if (this.source) source.setSourceContent(data.filename, this.source);
		return source;
	}
}
