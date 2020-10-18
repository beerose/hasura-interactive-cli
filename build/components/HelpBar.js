"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpBar = void 0;
const react_1 = __importDefault(require("react"));
const ink_1 = require("ink");
const ink_link_1 = __importDefault(require("ink-link"));
const helpers = {
    submit: "enter — submit",
    enter: "enter — select",
    back: "left arrow — back",
    help: "h — help",
    arrows: "up/down arrows — navigate",
};
const helpersConfig = {
    select: ["enter", "arrows"],
    input: ["submit"],
    root: ["enter"],
};
exports.HelpBar = (props) => {
    return (react_1.default.createElement(ink_1.Box, { borderStyle: "singleDouble" },
        helpersConfig[props.type].map((h) => (react_1.default.createElement(ink_1.Box, { key: h },
            react_1.default.createElement(ink_1.Text, { color: "green" },
                " ",
                helpers[h]),
            react_1.default.createElement(ink_1.Text, null, " |")))),
        props.back && (react_1.default.createElement(ink_1.Box, null,
            react_1.default.createElement(ink_1.Text, { color: "green" },
                " ",
                props.backLabel || helpers.back),
            react_1.default.createElement(ink_1.Text, null, " |"))),
        react_1.default.createElement(ink_1.Text, { color: "green" }, " esc \u2014 exit"),
        react_1.default.createElement(ink_1.Box, { marginLeft: 1 },
            react_1.default.createElement(ink_link_1.default, { url: "https://sindresorhus.com", fallback: false },
                "| ",
                react_1.default.createElement(ink_1.Text, { color: "cyan" }, "DOCS")))));
};
