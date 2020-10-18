import React from "react";
import { Text } from "ink";
import { ItemProps } from "ink-select-input";
import { Option } from "../cli-spec";

export const FlagItemWithDesc = ({
	label,
	values,
	isSelected,
	config,
}: ItemProps & { values: Record<string, string>; config: Option[] }) => {
	if (label === "done") {
		return (
			<Text bold color="redBright">
				{Object.keys(values).length ? "Done" : "Skip"}
			</Text>
		);
	}

	return (
		<Text>
			{label}
			{values[label] && <Text color="red"> {values[label]}</Text>}
			<Text color="gray" italic dimColor={!isSelected}>
				{" "}
				— {config.find((f) => f.label === label)?.desc}
			</Text>
		</Text>
	);
};
