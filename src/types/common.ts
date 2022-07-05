export type StringIdexed<T> =
	{ [key: string]: T };

export interface Patch<T> {
	data: Partial<T>;
	hashes: StringIdexed<string>;
}

export type Config<
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
