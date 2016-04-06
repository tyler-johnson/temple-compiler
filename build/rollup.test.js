import babel from "rollup-plugin-babel";
import json from "rollup-plugin-json";
import pegjs from "./pegjs.js";
import {resolve,dirname,join} from "path";
import fs from "fs-promise";

const outputs = resolve(__dirname, "../test/outputs");
const rel_regex = /^\.{1,2}$|^\.{0,2}\//;

export default {
	onwarn: ()=>{},
	format: "cjs",
	plugins: [
		{
			resolveId: function(id, p) {
				if (!p || !rel_regex.test(id)) return;
				return resolve(dirname(p), id);
			},
			load: function(id) {
				if (id !== outputs) return;

				return fs.readdir(id).then(dirs => {
					return Promise.all(dirs.map(dir => {
						let dirname = join(id, dir);
						return fs.stat(dirname).then(stat => {
							if (!stat.isDirectory()) return;

							let out = `test(${JSON.stringify(dir)}, (t) => {\n`;
							out += `\tt.plan(1);\n`;

							return Promise.all([
								fs.readFile(join(dirname, "input.html"), "utf8").catch(e => {
									if (e.code !== "ENOENT") throw e;
								}),
								fs.readFile(join(dirname, "output.js"), "utf8").catch(e => {
									if (e.code !== "ENOENT") throw e;
								}),
								fs.readFile(join(dirname, "options.json"), "utf8").then(src => {
									return JSON.parse(src);
								}).catch(e => {
									if (e.code !== "ENOENT") throw e;
									return {};
								})
							]).then((res) => {
								let input = JSON.stringify(res[0]);
								let output = JSON.stringify(res[1]);
								let options = JSON.stringify(res[2]);

								out += `\tconst result = Temple.compile(${input}, ${options});\n`;
								// out += `\tconsole.log(result.code);\n`;
								out += `\tt.equals(result.code, ${output}, "correct output for ${dir}");\n`;
								out += "});\n";

								return out;
							});
						});
					}));
				}).then((dirs) => {
					return `import test from "tape";\nconst Temple = require("./");\n\n` + dirs.join("\n");
				});
			}
		},

		pegjs(),
		json(),
		babel({
			exclude: [ "node_modules/**" ],
			include: [ "src/**" ],
			plugins: [
				"external-helpers",
				"transform-es2015-destructuring",
				"transform-es2015-parameters",
				"transform-async-to-generator",
				"transform-object-rest-spread"
			]
		})
	]
};
