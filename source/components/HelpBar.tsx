import React from "react";
import { Box, Text } from "ink";
import Link from "ink-link";

const helpers = {
	submit: "enter — submit",
	enter: "enter — select",
	back: "left arrow — back",
	help: "h — help",
	arrows: "up/down arrows — navigate",
};

type HelperType = "select" | "root" | "input";

const helpersConfig: Record<HelperType, (keyof typeof helpers)[]> = {
	select: ["enter", "arrows"],
	input: ["submit"],
	root: ["enter"],
};

type HelpBarProps = {
	type: HelperType;
	back?: boolean;
	backLabel?: string;
};
export const HelpBar = (props: HelpBarProps) => {
	return (
		<Box borderStyle="singleDouble">
			{helpersConfig[props.type].map((h) => (
				<Box key={h}>
					<Text color="green"> {helpers[h]}</Text>
					<Text> |</Text>
				</Box>
			))}
			{props.back && (
				<Box>
					<Text color="green"> {props.backLabel || helpers.back}</Text>
					<Text> |</Text>
				</Box>
			)}
			<Text color="green"> esc — exit</Text>
			<Box marginLeft={1}>
				<Link url="https://sindresorhus.com" fallback={false}>
					| <Text color="cyan">DOCS</Text>
				</Link>
			</Box>
		</Box>
	);
};
