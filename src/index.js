import * as AST from "./ast/index.js";
import parse from "./parse.js";
import compile from "./compile.js";
import exec from "./exec.js";
import compileFile from "./compile-file.js";

export { AST, parse, compile, compileFile, exec };
