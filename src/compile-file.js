import {rollup} from "rollup";
import path from "path";
import {includes,assign} from "lodash";
import compile, {srcToString} from "./compile";
import inject from "@mrgalaxy/rollup-plugin-inject";

export default function compileFile(files, options={}) {
	let basedir = options.basedir || ".";

	files = [].concat(files).filter(Boolean).map(file => {
		return path.resolve(basedir, file);
	});

	if (!files.length) {
		throw new Error("Missing file name to compile.");
	}

	let exts = [].concat(options.extensions || ".html").filter(Boolean);
	const templates = [];

	return rollup({
		onwarn: () => {},
		entry: "_entry.js",
		plugins: [
			{
				resolveId: function(id) {
					if (id === "_entry.js" || id === "_template.js") return id;
				},
				load: function(id) {
					if (id === "_entry.js") {
						return files.map(f => `import ${JSON.stringify(f)};`).join("\n") + "\nexport default Template;\n";
					}

					if (id === "_template.js") {
						return "export default {};\n";
					}
				},
				transform: function(src, id) {
					if (!includes(exts, path.extname(id))) return;
					templates.push(id);

					let res = compile(src, assign({}, options, {
						filename: id,
						extensions: exts,
						format: "none"
					}));

					return {
						code: res.code,
						map: res.map.toJSON()
					};
				}
			},
			inject({
				Temple: "templejs",
				Template: "_template.js",
				idom: [ "templejs", "idom" ],
				decorators: [ "templejs", "decorators" ]
			})
		].concat(options.plugins).filter(Boolean)
	}).then(function(bundle) {
		let out = bundle.generate({
			format: options.format,
			sourceMap: true,
			exports: "default",
			useStrict: false,
			moduleId: options.moduleId,
			moduleName: options.moduleName,
			globals: {
				templejs: "Temple"
			}
		});

		out.templates = templates;
		out.toString = srcToString;

		return out;
	});
}
