import {
	Resource,
	User,
} from "../testdata/domainModel";
import { RecursivePartial } from "./recursivePartial";

export type StringIdexed<T> =
	{ [key: string]: T };

export interface Patch<T> {
	data: RecursivePartial<T>;
	hashes: StringIdexed<string>;
}

export type KeysOfUnion<T> =
	T extends T
		? keyof T
		: never;

export type ConflictConfig<
	TResourceTypes extends string,
	TResources extends Object,
> = {
	[key in TResourceTypes]: {
		conflictGroups: {
			name: string;
			properties: (
				| KeysOfUnion<TResources>
				| StringIdexed<
						RecKeyof<Resource>[]
				  >
			)[];
		}[];
	};
};

type RecKeyof<T> = T extends
	| string
	| number
	| bigint
	| boolean
	| null
	| undefined
	| ((...args: any) => any)
	? never
	: {
			[K in keyof T &
				string]: T[K] extends Array<any>
				? `${K}`
				:
						| `${K}`
						| RecKeyof<T[K]>;
	  }[keyof T & string];
