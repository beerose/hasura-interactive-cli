#!/usr/bin/env node
import React from "react";
import { render } from "ink";
import meow from "meow";
import App from "./ui";

const cli = meow(
	`
	Usage
	  $ hasura-cli-ink <input>

	Options
		--name  Your name

	Examples
	  $ hasura-cli-ink --name=Jane
	  Hello, Jane
`,
	{
		flags: {
			name: {
				type: "string",
			},
		},
	}
);

render(<App flags={cli.flags} args={cli.input} />);
