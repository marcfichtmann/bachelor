import {
	config,
	Resource,
	User,
} from "../testdata/domainModel";
import { StringIdexed } from "../types/common";
import { RecursivePartial } from "../types/recursivePartial";
import { createHashableObject } from "./createConflictHashObject";
import { hasConflict } from "./hasConflict";

interface TestCase<
	TResource,
> {
	description: string;
	input: {
		currentState: TResource;
		patch: {
			data: RecursivePartial<TResource>;
			hashes: StringIdexed<any>;
		};
	};
	expected: boolean;
}
[];

const defaultUser: User = {
	country: "de",
	firstName: "max",
	lastName: "mustermann",
	publicId: "1",
	groups: [
		{
			country: "en",
			name: "group1",
			publicId: "01",
			users: [],
		},
		{
			country: "en",
			name: "group2",
			publicId: "02",
			users: [
				{
					country: "de",
					firstName: "max",
					lastName:
						"mustermann",
					publicId: "1",
					groups: [
						{
							country: "en",
							name: "group1",
							publicId: "01",
							users: [],
						},
						{
							country: "en",
							name: "group2",
							publicId: "02",
							users: [],
						},
					],
				},
			],
		},
	],
};

const defaultUserHashes =
	createHashableObject(
		defaultUser,
		config.user,
	);

const testCases: TestCase<Resource>[] =
	[
		{
			description:
				"update same conflictGroup",
			input: {
				currentState: {
					...defaultUser,
					firstName:
						"maximilian",
				},
				patch: {
					data: {
						firstName:
							"peter",
					},
					hashes:
						defaultUserHashes,
				},
			},
			expected: true,
		},
		{
			description:
				"update different conflictGroup",
			input: {
				currentState: {
					...defaultUser,
					firstName:
						"maximilian",
				},
				patch: {
					data: {
						country: "en",
					},
					hashes:
						defaultUserHashes,
				},
			},
			expected: false,
		},
		{
			description:
				"update multiple conflictGroups without conflict",
			input: {
				currentState: {
					...defaultUser,
				},
				patch: {
					data: {
						firstName:
							"maximilian",
						country: "en",
					},
					hashes:
						defaultUserHashes,
				},
			},
			expected: false,
		},
		{
			description:
				"update multiple conflictGroups with one conflict",
			input: {
				currentState: {
					...defaultUser,
					firstName:
						"maximilian",
				},
				patch: {
					data: {
						firstName: "max",
						country: "en",
					},
					hashes:
						defaultUserHashes,
				},
			},
			expected: true,
		},
		{
			description:
				"update multiple conflictGroups with multiple conflict",
			input: {
				currentState: {
					...defaultUser,
					firstName:
						"maximilian",
					country: "sw",
				},
				patch: {
					data: {
						firstName: "max",
						country: "en",
					},
					hashes:
						defaultUserHashes,
				},
			},
			expected: true,
		},
		{
			description:
				"update relationship with one conflict",
			input: {
				currentState: {
					...defaultUser,
					groups: [
						{
							...defaultUser
								.groups[0],
							publicId:
								"0001",
						},
						defaultUser
							.groups[1],
					],
				},
				patch: {
					data: {
						groups: [
							{
								country: "de",
							},
						],
					},
					hashes:
						defaultUserHashes,
				},
			},
			expected: true,
		},
		{
			description:
				"update relationship without conflict",
			input: {
				currentState: {
					...defaultUser,
					groups: [
						{
							...defaultUser
								.groups[0],
							publicId:
								"0001",
						},
						defaultUser
							.groups[1],
					],
				},
				patch: {
					data: {
						groups: [
							{
								name: "testgroup",
							},
						],
					},
					hashes:
						defaultUserHashes,
				},
			},
			expected: false,
		},
		{
			description:
				"update with conflict in Relationship",
			input: {
				currentState: {
					...defaultUser,
					groups: [
						{
							...defaultUser
								.groups[0],
							publicId:
								"0001",
						},
						defaultUser
							.groups[1],
					],
				},
				patch: {
					data: {
						firstName:
							"test123",
					},
					hashes:
						defaultUserHashes,
				},
			},
			expected: true,
		},
	];

describe("testing hasConflict", () => {
	testCases.forEach(
		(testCase) => {
			it(
				testCase.description,
				() => {
					const result =
						hasConflict(
							JSON.stringify(
								testCase.input
									.patch,
							),
							testCase.input
								.currentState,
							config.user,
						);
					expect(result).toBe(
						testCase.expected,
					);
				},
			);
		},
	);
});
