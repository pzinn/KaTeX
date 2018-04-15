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
        numArgs: 1,
	numOptionalArgs: 1,
	argTypes: ["url","url"], // really, should just be raw?
    },
    handler: (context, args,optArgs) => {
        const body = args[0].value;
	const size = optArgs[0].value;
        return {
            type: "html",
            body: body,
	    size: size,
        };
    },
    htmlBuilder: (group, options) => {
        return new domTree.rawhtml(group.value.body,group.value.size);
    },
    mathmlBuilder: (group, options) => {// TEMP
        const node = new mathMLTree.MathNode("mspace");

        const dimension = 0;
        node.setAttribute("width", dimension + "em");

        return node;
    },
});
