// @flow
import {_htmlGroupBuilders, _mathmlGroupBuilders} from "./defineFunction";

import type Parser from "./Parser";
import type {AnyParseNode} from "./parseNode";
import type {ArgType, Mode} from "./types";
import type {NodeType} from "./parseNode";
import type {HtmlBuilder, MathMLBuilder} from "./defineFunction";

/**
 * The context contains the following properties:
 *  - mode: current parsing mode.
 *  - envName: the name of the environment, one of the listed names.
 *  - parser: the parser object.
 */
type EnvContext = {|
    mode: Mode,
    envName: string,
    parser: Parser,
|};

/**
 *  - context: information and references provided by the parser
 *  - args: an array of arguments passed to \begin{name}
 *  - optArgs: an array of optional arguments passed to \begin{name}
 */
type EnvHandler = (
    context: EnvContext,
    args: AnyParseNode[],
    optArgs: (?AnyParseNode)[],
) => AnyParseNode;

/**
 *  - numArgs: (default 0) The number of arguments after the \begin{name} function.
 *  - numOptionalArgs: (default 0) Just like for a function
 * NOT YET SUPPORTED:
 *  - argTypes: (optional) Just like for a function
 *  - allowedInText: (default false) Whether or not the environment is allowed
 *                   inside text mode (not enforced yet).
 */
type EnvProps = {|
    numArgs?: number,
    numOptionalArgs?: number,
|};

/**
 * Final environment spec for use at parse time.
 * This is almost identical to `EnvDefSpec`, except it
 * 1. includes the function handler
 * 2. requires all arguments except argType
 * It is generated by `defineEnvironment()` below.
 */
export type EnvSpec<NODETYPE: NodeType> = {|
    type: NODETYPE, // Need to use the type to avoid error. See NOTES below.
    numArgs: number,
    argTypes?: ArgType[],
    allowedInText: boolean,
    numOptionalArgs: number,
    handler: EnvHandler,
|};

/**
 * All registered environments.
 * `environments.js` exports this same dictionary again and makes it public.
 * `Parser.js` requires this dictionary via `environments.js`.
 */
export const _environments: {[string]: EnvSpec<*>} = {};

type EnvDefSpec<NODETYPE: NodeType> = {|
    // Unique string to differentiate parse nodes.
    type: NODETYPE,

    // List of functions which use the give handler, htmlBuilder,
    // and mathmlBuilder.
    names: Array<string>,

    // Properties that control how the environments are parsed.
    props: EnvProps,

    handler: EnvHandler,

    // This function returns an object representing the DOM structure to be
    // created when rendering the defined LaTeX function.
    htmlBuilder: HtmlBuilder<NODETYPE>,

    // This function returns an object representing the MathML structure to be
    // created when rendering the defined LaTeX function.
    mathmlBuilder: MathMLBuilder<NODETYPE>,
|};

export default function defineEnvironment<NODETYPE: NodeType>({
    type,
    names,
    props,
    handler,
    htmlBuilder,
    mathmlBuilder,
}: EnvDefSpec<NODETYPE>) {
    // Set default values of environments.
    const data = {
        type,
        numArgs: props.numArgs || 0,
        numOptionalArgs: props.numOptionalArgs || 0,
        allowedInText: false,
        handler,
    };
    for (let i = 0; i < names.length; ++i) {
        // TODO: The value type of _environments should be a type union of all
        // possible `EnvSpec<>` possibilities instead of `EnvSpec<*>`, which is
        // an existential type.
        _environments[names[i]] = data;
    }
    if (htmlBuilder) {
        _htmlGroupBuilders[type] = htmlBuilder;
    }
    if (mathmlBuilder) {
        _mathmlGroupBuilders[type] = mathmlBuilder;
    }
}
