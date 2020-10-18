export type Command = Record<
	string,
	| {
			commands: Command;
	  }
	| {
			args: Option[];
			flags: Option[];
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
	},
	console: {
		args: [],
		flags: [],
	},
	migrate: {
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
		commands: {
			create: { commands: {} },
			codegen: { commands: {} },
			"use-codegen": { commands: {} },
		},
	},
	metadata: {
		commands: {
			apply: { commands: {} },
			clear: { commands: {} },
			diff: { commands: {} },
			export: { commands: {} },
			inconsistency: { commands: {} },
			reload: { commands: {} },
		},
	},
	version: {
		args: [],
		flags: [],
	},
};
