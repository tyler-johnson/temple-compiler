import test from "tape";
const Temple = require("./");

test("executes template", (t) => {
	t.plan(1);
	global.__test_state = { ran: false };
	Temple.exec(`<script>this.__test_state.ran = true;</script>`);
	t.ok(global.__test_state.ran, "executed the code");
	delete global.__test_state;
});

import "./outputs";
