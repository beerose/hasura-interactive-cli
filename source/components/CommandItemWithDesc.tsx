import React from "react";
import { Text } from "ink";
import { ItemProps } from "ink-select-input";

export const CommandItemWithDesc = (props: ItemProps) => {
	const [name, desc] = props.label.split(";");
	return (
		<Text>
			{name}
			<Text color="gray" italic dimColor={!props.isSelected}>
				{" "}
				— {desc}
			</Text>
		</Text>
	);
};
