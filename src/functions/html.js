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
	argTypes: ["url","url","url"], // really, last should just be raw? or text? and first 2 should be size
        allowedInText: true,
    },
    handler: (context, args) => {
        return {
            type: "html",
	    height: args[0].value.value,
	    depth: args[1].value.value,
            body: args[2].value.value
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
