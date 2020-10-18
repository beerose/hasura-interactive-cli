"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const ink_1 = require("ink");
const ink_select_input_1 = __importDefault(require("ink-select-input"));
const ink_text_input_1 = __importDefault(require("ink-text-input"));
const ink_gradient_1 = __importDefault(require("ink-gradient"));
const ink_big_text_1 = __importDefault(require("ink-big-text"));
const HelpBar_1 = require("./components/HelpBar");
const cli_spec_1 = require("./cli-spec");
const initialState = {
    status: "initial",
    command: null,
    subCommands: [],
    args: [],
    flags: [],
};
const CommandSelect = ({ root, onSelect, config, }) => {
    if (!(config && "commands" in config)) {
        throw new Error("no key commands");
    }
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(ink_select_input_1.default, { items: Object.keys(config.commands).map((item) => ({
                label: item,
                value: item,
            })), onSelect: (item) => onSelect(item.value) }),
        react_1.default.createElement(HelpBar_1.HelpBar, { type: root ? "root" : "select" })));
};
const ArgsInputs = ({ onSubmit, onFinish, config, }) => {
    if (!("args" in config)) {
        throw new Error("no key args");
    }
    const [index, setIndex] = react_1.useState(0);
    const [values, setValues] = react_1.useState({});
    ink_1.useInput((input) => {
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
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(ink_1.Box, null,
            react_1.default.createElement(ink_1.Box, { marginX: 1 },
                react_1.default.createElement(ink_1.Text, { color: "cyanBright" }, currArg.label)),
            react_1.default.createElement(ink_text_input_1.default, { value: values[currArg.key] || "", onChange: (v) => {
                    console.log({ v });
                    if (v)
                        setValues((prev) => (Object.assign(Object.assign({}, prev), { [currArg.key]: v })));
                }, onSubmit: (v) => {
                    if (v) {
                        console.log({ v });
                        onSubmit({ key: currArg.key, value: values[currArg.key] });
                        setIndex((prev) => prev + 1);
                    }
                } })),
        react_1.default.createElement(HelpBar_1.HelpBar, { type: "input", back: index > 0 })));
};
const Flags = ({ onFinish, config, }) => {
    if (!("flags" in config)) {
        throw new Error("no key args");
    }
    const [values, setValues] = react_1.useState({});
    const [selected, setSelected] = react_1.useState("");
    ink_1.useInput((_, key) => {
        if (key.leftArrow) {
            if (selected) {
                setSelected("");
                setValues((prev) => {
                    const next = Object.assign({}, prev);
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
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(ink_1.Box, null,
                react_1.default.createElement(ink_1.Box, { marginRight: 1 },
                    react_1.default.createElement(ink_1.Text, null,
                        selected,
                        ": ")),
                react_1.default.createElement(ink_1.Text, { color: "cyanBright" },
                    react_1.default.createElement(ink_text_input_1.default, { value: values[selected] || "", onChange: (v) => {
                            setValues((prev) => (Object.assign(Object.assign({}, prev), { [selected]: v })));
                        }, onSubmit: () => {
                            setSelected("");
                        } }))),
            react_1.default.createElement(HelpBar_1.HelpBar, { type: "input", back: true, backLabel: "left arrow \u2014 cancel" })));
    }
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(ink_1.Box, { marginBottom: 1, marginLeft: 2 },
            react_1.default.createElement(ink_1.Text, null, "Command flags")),
        react_1.default.createElement(ink_select_input_1.default, { items: [
                { value: "done", label: "done" },
                ...config.flags.map((flag) => ({
                    value: flag.key,
                    label: flag.label,
                })),
            ], itemComponent: (props) => {
                var _a;
                if (props.label === "done") {
                    return (react_1.default.createElement(ink_1.Text, { bold: true, color: "redBright" }, Object.keys(values).length ? "Done" : "Skip"));
                }
                return (react_1.default.createElement(ink_1.Text, null,
                    props.label,
                    values[props.label] && (react_1.default.createElement(ink_1.Text, { color: "red" },
                        " ",
                        values[props.label])),
                    react_1.default.createElement(ink_1.Text, { color: "gray", italic: true, dimColor: !props.isSelected },
                        " ",
                        "\u2014 ", (_a = config.flags.find((f) => f.label === props.label)) === null || _a === void 0 ? void 0 :
                        _a.desc)));
            }, onSelect: (v) => setSelected(v.label) }),
        react_1.default.createElement(HelpBar_1.HelpBar, { type: "select", back: true })));
};
const Main = ({}) => {
    const [state, dispatch] = react_1.useReducer((s, action) => {
        switch (action.type) {
            case "set-root-command":
                return Object.assign(Object.assign({}, s), { status: "commands" in cli_spec_1.commandsConfig[action.payload] ? "command" : "args", command: action.payload, args: [] });
            case "set-sub-command":
                const config = s.subCommands.reduce((acc, command) => ("commands" in acc ? acc.commands[command] : acc), cli_spec_1.commandsConfig[s.command]);
                return Object.assign(Object.assign({}, s), { status: "commands" in config ? "command" : "args", subCommands: [...s.subCommands, action.payload] });
            case "go-to-options":
                return Object.assign(Object.assign({}, s), { status: "args" });
            case "go-to-flags": {
                return Object.assign(Object.assign({}, s), { status: "flags" });
            }
            case "set-flags": {
                return Object.assign(Object.assign({}, s), { flags: [...s.flags, action.payload] });
            }
            case "set-args":
                return Object.assign(Object.assign({}, s), { args: [...s.args, action.payload] });
            case "go-back":
                if (s.status === "flags") {
                    return Object.assign(Object.assign({}, s), { status: "args" });
                }
                return s;
            case "exit":
                return Object.assign(Object.assign({}, s), { status: "exiting" });
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
    }, cli_spec_1.commandsConfig[state.command]);
    switch (state.status) {
        case "initial":
            return (react_1.default.createElement(CommandSelect, { root: true, config: { commands: cli_spec_1.commandsConfig }, onSelect: (item) => {
                    dispatch({
                        type: "set-root-command",
                        payload: item,
                    });
                } }));
        case "command":
            if (!state.command) {
                return react_1.default.createElement(ink_1.Text, null, "Error");
            }
            return (react_1.default.createElement(CommandSelect, { config: currentConfig, onSelect: (item) => dispatch({
                    type: "set-sub-command",
                    payload: item,
                }) }));
        case "args":
            return (react_1.default.createElement(ArgsInputs, { config: currentConfig, onFinish: () => dispatch({ type: "go-to-flags" }), onSubmit: (payload) => dispatch({
                    type: "set-args",
                    payload,
                }) }));
        case "flags":
            return (react_1.default.createElement(Flags, { config: currentConfig, onFinish: () => dispatch({ type: "go-to-flags" }), onSubmit: (payload) => dispatch({
                    type: "set-args",
                    payload,
                }) }));
        case "done":
        case "exiting":
    }
    return null;
};
const App = ({ args }) => {
    const { exit } = ink_1.useApp();
    ink_1.useInput((_, key) => {
        if (key.escape) {
            setTimeout(() => {
                exit();
            }, 500);
        }
    });
    return (react_1.default.createElement(ink_1.Box, { flexDirection: "column" },
        react_1.default.createElement(ink_gradient_1.default, { name: "passion" },
            react_1.default.createElement(ink_big_text_1.default, { font: "tiny", text: "Hasura" })),
        react_1.default.createElement(Main, { args: args })));
};
module.exports = App;
exports.default = App;
