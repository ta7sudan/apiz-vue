import { GroupOptions } from "apiz-ng";
import { Options } from "apiz-browser-client";

interface PluginOptions extends GroupOptions, Options {
	meta: object
}

export class APIs {
	constructor(options: PluginOptions);
}
