import { Resources } from "./domainModel";

export const mockData: Resources =
	{
		user: [
			{
				publicId: "1",
				firstName: "Max",
				lastName:
					"Mustermann",
				country: "DE",
				groups: [
					{
						country: "EN",
						name: "testGroup2",
						publicId: "2",
						users: [],
					},
				],
			},
			{
				publicId: "2",
				firstName:
					"Guadalupe",
				lastName: "Marks",
				country: "DE",
				groups: [
					{
						country: "EN",
						name: "testGroup2",
						publicId: "2",
						users: [],
					},
					{
						country: "EN",
						name: "testGroup3",
						publicId: "3",
						users: [],
					},
				],
			},
			{
				publicId: "3",
				firstName: "Ricardo",
				lastName: "Maranto",
				country: "DE",
				groups: [
					{
						country: "EN",
						name: "testGroup1",
						publicId: "1",
						users: [],
					},
				],
			},
			{
				publicId: "4",
				firstName: "Michelle",
				lastName:
					"Strickland",
				country: "DE",
				groups: [
					{
						country: "EN",
						name: "testGroup1",
						publicId: "1",
						users: [],
					},
					{
						country: "EN",
						name: "testGroup2",
						publicId: "2",
						users: [],
					},
				],
			},
		],
		group: [
			{
				country: "EN",
				name: "testGroup1",
				publicId: "1",
				users: [],
			},
			{
				country: "EN",
				name: "testGroup2",
				publicId: "2",
				users: [],
			},
			{
				country: "EN",
				name: "testGroup3",
				publicId: "3",
				users: [],
			},
		],
	};
