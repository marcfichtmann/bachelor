import { RecursivePartial } from "./recursivePartial";

export type StringIdexed<T> =
	{ [key: string]: T };

export interface Patch<T> {
	data: RecursivePartial<T>;
	hashes: StringIdexed<string>;
}

export type ConflictConfig<
	TResourceTypes extends string,
> = {
	[key in TResourceTypes]: {
		conflictGroups: {
			name: string;
			properties: (
				| string
				| StringIdexed<
						string[]
				  >
			)[];
		}[];
	};
};
