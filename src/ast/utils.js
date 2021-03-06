import {isArray,includes,isString,last,assign} from "lodash";

export function header(data, h) {
	if (isArray(data.headers) && !includes(data.headers, h)) {
		data.headers.push(h);
	}
}

export function hash(str) {
	var h = 0, i, chr, len;

	if (str.length === 0) return h;

	for (i = 0, len = str.length; i < len; i++) {
		chr = str.charCodeAt(i);
		h = ((h << 5) - h) + chr;
		h |= 0; // Convert to 32bit integer
	}

	return h;
}

export function compileGroup(nodes, data) {
	return nodes.map(function(n, i) {
		return n.compile(addKey(data, i.toString()));
	});
}

export function compileGroupAsync(nodes, data) {
	nodes = nodes.slice(0);
	let out = [];
	let next = () => {
		return !nodes.length ? Promise.resolve() :
			nodes.shift().compile(data).then(o => {
				out.push(o);
				return next();
			});
	};
	return next().then(() => out);
}

export function getKey(data) {
	return (data.key || []).reduce(function(memo, v) {
		if (isString(v) && isString(last(memo))) {
			memo.push(memo.pop() + "-" + v);
		} else {
			memo.push(v);
		}

		return memo;
	}, []).map(function(v, i, l) {
		if (typeof v === "object") return v.value;
		if (i !== 0) v = "-" + v;
		if (i !== l.length - 1) v += "-";
		return JSON.stringify(v);
	}).join(" + ");
}

export function addKey(data, key) {
	let base = data.key || [];
	return assign({}, data, {
		key: [].concat(base, key)
	});
}

export function resetKey(data) {
	return assign({}, data, { key: [] });
}

var entity = /&(?:#x[a-f0-9]+|#[0-9]+|[a-z0-9]+);?/ig;

export function containsEntities(str) {
	return entity.test(str);
}
