// @flow
import defineFunction from "../defineFunction";
import domTree from "../domTree";
import mathMLTree from "../mathMLTree";
// import { calculateSize } from "../units";

//import * as html from "../buildHTML";
//import * as mml from "../buildMathML";

defineFunction({
    type: "rawhtml",
    names: ["\\rawhtml"],
    props: {
        numArgs: 3,
	argTypes: ["url","size","size"], // first should be new type ("raw"). FIX
        allowedInText: true,
    },
    handler: (context, args) => {
        return {
            type: "rawhtml",
	    height: args[1].result.value.number, // eww
	    depth: args[2].result.value.number,
            body: args[0].url,
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
