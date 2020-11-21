import { exec } from "child_process";
import { Box, Text } from "ink";
import React, { useEffect, useState } from "react";
import Spinner from "ink-spinner";

export const RunCommand = ({
	rootCommand,
	subCommands,
	args,
	flags,
	onFinish,
	renderResult,
}: {
	rootCommand: string;
	subCommands: string[];
	args: { key: string; value: string }[];
	flags: { key: string; value: string }[];
	onFinish: () => void;
	renderResult?: (data: string) => JSX.Element;
}) => {
	const [result, setResult] = useState("");

	useEffect(() => {
		const finalCommand = `node_modules/.bin/hasura ${rootCommand} ${subCommands.join(
			" "
		)} ${args.map(({ value }) => value)} ${flags.map(
			({ key, value }) => `${key} ${value}`
		)}`.trim();
		exec(finalCommand, (err, stdout) => {
			if (err) {
				//
				return;
			}
			setResult(stdout);
			onFinish();
		});
	}, [rootCommand, subCommands, args, flags]);

	return (
		<Box paddingY={1}>
			{result ? (
				<Box borderStyle="single" flexDirection="column" paddingX={1}>
					{renderResult ? renderResult(result) : result}
				</Box>
			) : (
				<Text color="magenta">
					<Spinner type="dots2" />
				</Text>
			)}
		</Box>
	);
};
