// @flow
import defineFunction from "../defineFunction";
import { rawhtml } from "../domTree";
import mathMLTree from "../mathMLTree";
import {assertNodeType} from "../parseNode";
import { calculateSize } from "../units";

//import * as html from "../buildHTML";
//import * as mml from "../buildMathML";

defineFunction({
    type: "rawhtml",
    names: ["\\rawhtml"],
    props: {
        numArgs: 3,
	//	argTypes: ["raw","size","size"], // unfortunately the new "raw" type is too restrictive (no %)
	argTypes: ["url","size","size"], // unfortunately the new "raw" type is too restrictive (no %)
        allowedInText: true,
    },
    handler: ({parser, funcName, token}, args) => {
	//        const value = assertNodeType(args[0], "raw").string;
	const value = args[0].url;
        if (parser.settings.strict) {
            parser.settings.reportNonstrict("htmlExtension",
                "HTML extension is disabled on strict mode");
        }

        let trustContext = {
                    command: "\\rawhtml",
                    content: value
                };

        if (!parser.settings.isTrusted(trustContext)) {
            return parser.formatUnsupportedCmd(funcName);
        }

        return {
            type: "rawhtml",
	    height: args[1].value,
	    depth: args[2].value,
            body: value,
        };
    },
    htmlBuilder: (group, options) => {
        const height = calculateSize(group.height, options);
	const depth = calculateSize(group.depth, options);
        return new rawhtml(height,depth,group.body);
    },
    mathmlBuilder: (group, options) => {// TEMP
        const node = new mathMLTree.MathNode("mspace");

        const dimension = 0;
        node.setAttribute("width", dimension + "em");

        return node;
    },
});
