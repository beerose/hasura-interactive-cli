#!/usr/bin/env node
import React from "react";
import { render } from "ink";
import meow from "meow";
import App from "./ui";

const cli = meow(
	`
	Usage
	  $ hasura-cli-ink <input>
`
);

render(<App flags={cli.flags} args={cli.input} />, {
	// debug: true,
});
