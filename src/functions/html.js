// @flow
import defineFunction, {ordargument} from "../defineFunction";
import buildCommon from "../buildCommon";
import domTree from "../domTree";
import mathMLTree from "../mathMLTree";
import { calculateSize } from "../units";

import * as html from "../buildHTML";
import * as mml from "../buildMathML";

defineFunction({
    type: "html",
    names: ["\\html"],
    props: {
        numArgs: 3,
	argTypes: ["url","size","size"], // really, first should be some new type ("raw"). FIX
        allowedInText: true,
    },
    handler: (context, args) => {
        return {
            type: "html",
	    height: args[1].result.value.number, // eww
	    depth: args[2].result.value.number,
            body: args[0].url
        };
    },
    htmlBuilder: (group, options) => {
        return new domTree.rawhtml(group.height,group.depth,group.body);
    },
    mathmlBuilder: (group, options) => {// TEMP
        const node = new mathMLTree.MathNode("mspace");

        const dimension = 0;
        node.setAttribute("width", dimension + "em");

        return node;
    },
});
