export declare type Command = Record<string, {
    commands: Command;
} | {
    args: Option[];
    flags: Option[];
}>;
export declare type Option = {
    key: string;
    label: string;
    desc?: string;
};
export declare const commandsConfig: Command;
