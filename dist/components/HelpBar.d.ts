/// <reference types="react" />
declare type HelperType = "select" | "root" | "input";
declare type HelpBarProps = {
    type: HelperType;
    back?: boolean;
    backLabel?: string;
};
export declare const HelpBar: (props: HelpBarProps) => JSX.Element;
export {};
