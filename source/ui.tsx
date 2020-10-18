import React, { FC, useReducer, useState } from "react";
import { Text, Box, useApp, useInput } from "ink";
import SelectInput from "ink-select-input";
import TextInput from "ink-text-input";
import Gradient from "ink-gradient";
import BigText from "ink-big-text";

import { HelpBar } from "./components/HelpBar";
import { commandsConfig, Command } from "./cli-spec";

type State = {
	status:
		| "initial"
		| "loading"
		| "command"
		| "args"
		| "exiting"
		| "done"
		| "flags";
	command: string | null;
	subCommands: string[];
	args: { key: string; value: string }[];
	flags: { key: string; value: string }[];
};

type Action =
	| { type: "set-root-command"; payload: string }
	| { type: "set-sub-command"; payload: string }
	| { type: "set-args"; payload: { key: string; value: string } }
	| { type: "go-to-options" }
	| { type: "go-to-flags" }
	| { type: "go-back" }
	| { type: "set-flags"; payload: State["flags"][0] }
	| { type: "exit" };

const initialState: State = {
	status: "initial",
	command: null,
	subCommands: [],
	args: [],
	flags: [],
};

const CommandSelect = ({
	root,
	onSelect,
	config,
}: {
	root?: boolean;
	onSelect: (item: string) => void;
	config: Command[0];
}) => {
	if (!(config && "commands" in config)) {
		throw new Error("no key commands");
	}

	return (
		<>
			<SelectInput
				items={Object.keys(config.commands).map((item) => ({
					label: item,
					value: item,
				}))}
				onSelect={(item) => onSelect(item.value)}
			/>
			<HelpBar type={root ? "root" : "select"} />
		</>
	);
};

const ArgsInputs = ({
	onSubmit,
	onFinish,
	config,
}: {
	onSubmit: (v: { key: string; value: string }) => void;
	onFinish: () => void;
	config: Command[0];
}) => {
	if (!("args" in config)) {
		throw new Error("no key args");
	}
	const [index, setIndex] = useState(0);
	const [values, setValues] = useState<Record<string, string>>({});

	useInput((input) => {
		if (input === "b") {
			if (index > 0) {
				setIndex((prev) => prev - 1);
			}
		}
	});

	if (index >= config.args.length) {
		onFinish();
		return null;
	}

	const currArg = config.args[index];
	return (
		<>
			<Box>
				<Box marginX={1}>
					<Text color="cyanBright">{currArg.label}</Text>
				</Box>

				<TextInput
					value={values[currArg.key] || ""}
					onChange={(v) => {
						console.log({ v });
						if (v) setValues((prev) => ({ ...prev, [currArg.key]: v }));
					}}
					onSubmit={(v) => {
						if (v) {
							console.log({ v });
							onSubmit({ key: currArg.key, value: values[currArg.key] });
							setIndex((prev) => prev + 1);
						}
					}}
				/>
			</Box>
			<HelpBar type="input" back={index > 0} />
		</>
	);
};

const Flags = ({
	onFinish,
	config,
}: {
	onSubmit: (v: { key: string; value: string }) => void;
	onFinish: () => void;
	config: Command[0];
}) => {
	if (!("flags" in config)) {
		throw new Error("no key args");
	}

	const [values, setValues] = useState<Record<string, string>>({});
	const [selected, setSelected] = useState("");

	useInput((_, key) => {
		if (key.leftArrow) {
			if (selected) {
				setSelected("");
				setValues((prev) => {
					const next = { ...prev };
					delete next[selected];
					return next;
				});
			}
		}
	});

	if (!config.flags.length) {
		onFinish();
		return null;
	}

	if (selected) {
		return (
			<>
				<Box>
					<Box marginRight={1}>
						<Text>{selected}: </Text>
					</Box>
					<Text color="cyanBright">
						<TextInput
							value={values[selected] || ""}
							onChange={(v) => {
								setValues((prev) => ({ ...prev, [selected]: v }));
							}}
							onSubmit={() => {
								setSelected("");
							}}
						/>
					</Text>
				</Box>
				<HelpBar type="input" back backLabel="left arrow — cancel" />
			</>
		);
	}

	return (
		<>
			<Box marginBottom={1} marginLeft={2}>
				<Text>Command flags</Text>
			</Box>
			<SelectInput
				items={[
					{ value: "done", label: "done" },
					...config.flags.map((flag) => ({
						value: flag.key,
						label: flag.label,
					})),
				]}
				itemComponent={(props) => {
					if (props.label === "done") {
						return (
							<Text bold color="redBright">
								{Object.keys(values).length ? "Done" : "Skip"}
							</Text>
						);
					}

					return (
						<Text>
							{props.label}
							{values[props.label] && (
								<Text color="red"> {values[props.label]}</Text>
							)}
							<Text color="gray" italic dimColor={!props.isSelected}>
								{" "}
								— {config.flags.find((f) => f.label === props.label)?.desc}
							</Text>
						</Text>
					);
				}}
				onSelect={(v) => setSelected(v.label)}
			/>
			<HelpBar type="select" back />
		</>
	);
};

const Main = ({}: { args: string[] }) => {
	const [state, dispatch] = useReducer((s: State, action: Action): State => {
		switch (action.type) {
			case "set-root-command":
				return {
					...s,
					status:
						"commands" in commandsConfig[action.payload] ? "command" : "args",
					command: action.payload,
					args: [],
				};
			case "set-sub-command":
				const config = s.subCommands.reduce(
					(acc, command) => ("commands" in acc ? acc.commands[command] : acc),
					commandsConfig[s.command!]
				);
				return {
					...s,
					status: "commands" in config ? "command" : "args",
					subCommands: [...s.subCommands, action.payload],
				};
			case "go-to-options":
				return {
					...s,
					status: "args",
				};
			case "go-to-flags": {
				return {
					...s,
					status: "flags",
				};
			}
			case "set-flags": {
				return {
					...s,
					flags: [...s.flags, action.payload],
				};
			}
			case "set-args":
				return {
					...s,
					args: [...s.args, action.payload],
				};
			case "go-back":
				if (s.status === "flags") {
					return { ...s, status: "args" };
				}
				return s;
			case "exit":
				return { ...s, status: "exiting" };
			default:
				return s;
		}
	}, initialState);

	// useInput((_, key) => {
	// 	if (key.leftArrow) {
	// 		dispatch({ type: "go-back" });
	// 	}
	// });

	const currentConfig = state.subCommands.reduce((acc, command) => {
		return "commands" in acc ? acc.commands[command] : acc;
	}, commandsConfig[state.command!]);

	switch (state.status) {
		case "initial":
			return (
				<CommandSelect
					root
					config={{ commands: commandsConfig }}
					onSelect={(item) => {
						dispatch({
							type: "set-root-command",
							payload: item as string,
						});
					}}
				/>
			);

		case "command":
			if (!state.command) {
				return <Text>Error</Text>;
			}

			return (
				<CommandSelect
					config={currentConfig}
					onSelect={(item: string) =>
						dispatch({
							type: "set-sub-command",
							payload: item,
						})
					}
				/>
			);

		case "args":
			return (
				<ArgsInputs
					config={currentConfig}
					onFinish={() => dispatch({ type: "go-to-flags" })}
					onSubmit={(payload: { key: string; value: string }) =>
						dispatch({
							type: "set-args",
							payload,
						})
					}
				/>
			);

		case "flags":
			return (
				<Flags
					config={currentConfig}
					onFinish={() => dispatch({ type: "go-to-flags" })}
					onSubmit={(payload: { key: string; value: string }) =>
						dispatch({
							type: "set-args",
							payload,
						})
					}
				/>
			);

		case "done":
		case "exiting":
	}
	return null;
};

const App: FC<{ flags: any; args: string[] }> = ({ args }) => {
	const { exit } = useApp();

	useInput((_, key) => {
		if (key.escape) {
			setTimeout(() => {
				exit();
			}, 500);
		}
	});

	return (
		<Box flexDirection="column">
			<Gradient name="passion">
				<BigText font="tiny" text="Hasura" />
			</Gradient>
			<Main args={args} />
		</Box>
	);
};

module.exports = App;
export default App;
