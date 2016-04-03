BIN = ./node_modules/.bin
SRC = $(wildcard src/* src/*/*)
TEST = $(wildcard test/* test/*/*)

build: index.js cli.js dist/browser.js

index.js: src/index.js $(SRC)
	$(BIN)/rollup $< -c build/rollup.node.js > $@

cli.js: src/cli.js $(SRC)
	echo "#!/usr/bin/env node" > $@
	$(BIN)/rollup $< -c build/rollup.node.js >> $@
	chmod +x $@

dist:
	mkdir -p $@

dist/browser.js: src/index.js $(SRC) dist
	$(BIN)/rollup $< -c build/rollup.browser.js > $@

test.js: test/index.js $(TEST)
	$(BIN)/rollup $< -c build/rollup.node.js > $@

test: test.js
	node $<

clean:
	rm -rf index.js test.js cli.js dist/

.PHONY: build clean test
