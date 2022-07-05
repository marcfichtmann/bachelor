import { StringIdexed } from "../types/common";
import {
	Resource,
	Config,
	ResourceTypes,
} from "../types/domainModel";

export function createHashableObject(
	ressource: Resource,
	config: Config[ResourceTypes],
): StringIdexed<any> {
	let object: StringIdexed<any> =
		{};
	config.conflictGroups.forEach(
		(group) => {
			object = {
				...object,
				[group.name]:
					createConflictGroupObject(
						ressource,
						group,
					),
			};
		},
	);
	return object;
}

function createConflictGroupObject(
	ressource: Resource,
	group: {
		name: string;
		properties: (
			| string
			| StringIdexed<string[]>
		)[];
	},
) {
	let conflictGroupObject: StringIdexed<any> =
		{};
	for (
		let index = 0;
		index <
		group.properties.length;
		index++
	) {
		const groupProperty =
			group.properties[index];
		if (
			typeof groupProperty ===
			"string"
		) {
			conflictGroupObject = {
				...conflictGroupObject,
				[groupProperty]:
					ressource[
						groupProperty as keyof typeof ressource
					],
			};
		} else {
			Object.keys(
				groupProperty,
			).forEach(
				(propertyKey) =>
					groupProperty[
						propertyKey
					].forEach(
						(
							indexProperty,
						) => {
							const property =
								ressource[
									propertyKey as keyof typeof ressource
								];
							conflictGroupObject =
								{
									...conflictGroupObject,
									[propertyKey]:
										Array.isArray(
											property,
										)
											? property.map(
													(
														obj,
													) => {
														let newObj: {
															[
																key: string
															]: any;
														} =
															{};
														Object.keys(
															obj,
														).forEach(
															(
																value,
															) => {
																if (
																	groupProperty[
																		propertyKey
																	].indexOf(
																		value,
																	) !==
																	-1
																) {
																	newObj =
																		{
																			...newObj,
																			[value]:
																				obj[
																					value
																				],
																		};
																}
															},
														);
														return newObj;
													},
											  )
											: {
													...conflictGroupObject[
														propertyKey
													],
													[indexProperty]:
														property[
															indexProperty as any
														],
											  },
								};
						},
					),
			);
		}
	}
	return conflictGroupObject;
}
