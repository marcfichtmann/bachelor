import { Config } from "../types/common";

export interface User {
	publicId: string;
	firstName: string;
	lastName: string;
	country: string;
	groups: Group[];
}

export interface Group {
	publicId: string;
	name: string;
	country: string;
}

export type ResourceTypes =
	| "user"
	| "group";

export type Resource =
	| User
	| Group;

export interface Resources {
	user: User[];
	group: Group[];
}

export const config: Config<ResourceTypes> =
	{
		user: {
			conflictGroups: [
				{
					name: "group1",
					properties: [
						"firstName",
						"lastName",
					],
				},
				{
					name: "group2",
					properties: [
						"country",
					],
				},
				{
					name: "group3",
					properties: [
						{
							groups: [
								"publicId",
								"country",
							],
						},
					],
				},
			],
		},
		group: {
			conflictGroups: [
				{
					name: "group1",
					properties: [
						"publicId",
						"name",
						"country",
					],
				},
			],
		},
	};
