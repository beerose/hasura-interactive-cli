import React from "react";
import { Box, Text } from "ink";

export type Command = Record<
	string,
	| {
			commands: Command;
			desc?: string;
	  }
	| {
			args: Option[];
			flags: Option[];
			desc?: string;
			renderResult?: (data: string) => JSX.Element;
	  }
>;

export type Option = { key: string; label: string; desc?: string };

const baseOptions = [
	{
		key: "--envfile",
		label: "Env file location",
		desc: '.env filename to load ENV vars from (default ".env")',
	},
	{
		key: "--log-level",
		label: "Log level",
		desc: 'log level (DEBUG, INFO, WARN, ERROR, FATAL) (default "INFO")',
	},
	{
		key: "--project string",
		label: "Project location",
		desc: "directory where commands are executed (default: current dir)",
	},
];

export const commandsConfig: Command = {
	init: {
		desc: "Initialize a directory for Hasura GraphQL engine migrations",
		args: [{ key: "project-name", label: "Name of your project: " }],
		flags: [
			{
				key: "--admin-secret",
				label: "Admin secret",
				desc: "admin secret for Hasura GraphQL engine",
			},
			{
				key: "--endpoint",
				label: "Hasura engine endpoint",
				desc: "http(s) endpoint for Hasura GraphQL engine",
			},
			{
				key: "--install-manifest",
				label: "Install manifest",
				desc: "install manifest to be cloned",
			},
			{
				key: "--version",
				label: "Config version",
				desc: "config version to be used (default 2)",
			},
			...baseOptions,
		],
		renderResult: (data: string) => (
			<>
				<Box paddingBottom={1}>
					<Text color="magentaBright">hasura init</Text>
				</Box>
				<Text>{JSON.parse(data).msg}</Text>
			</>
		),
	},
	console: {
		desc: "Open the console to manage the database and try out APIs",
		args: [],
		flags: [],
	},
	migrate: {
		desc: "Manage migrations on the database",
		commands: {
			apply: {
				commands: {},
			},
			create: { commands: {} },
			squash: { commands: {} },
			status: { commands: {} },
		},
	},
	actions: {
		desc: "Manage actions on hasura",
		commands: {
			create: { commands: {} },
			codegen: { commands: {} },
			"use-codegen": { commands: {} },
		},
	},
	metadata: {
		desc: "Manage Hasura GraphQL engine metadata saved in the database",
		commands: {
			// apply: { commands: {} },
			// clear: { commands: {} },
			// diff: { commands: {} },
			// export: { commands: {} },
			// inconsistency: { commands: {} },
			// reload: { commands: {} },
		},
	},
	version: {
		desc: "Print the Hasura CLI version",
		args: [],
		flags: [],
		renderResult: (data: string) => (
			<>
				<Box paddingBottom={1}>
					<Text color="magentaBright">hasura cli version</Text>
				</Box>
				<Text>{JSON.parse(data).version}</Text>
			</>
		),
	},
};
