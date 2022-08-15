import {
	ConflictConfig,
	StringIdexed,
} from "../types/common";

export function createHashableObject<
	TResourceTypes extends string,
	TResource extends Object,
>(
	ressource: TResource,
	config: ConflictConfig<
		TResourceTypes,
		TResource
	>[TResourceTypes],
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

function createConflictGroupObject<
	TResource extends StringIdexed<any>,
>(
	ressource: TResource,
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
			const groupPropertyObject = groupProperty;
			Object.keys(
				groupPropertyObject,
			).forEach(
				(groupPropertyKey) =>
				groupPropertyObject[
						groupPropertyKey
					].forEach(
						(
								propertyKey
						) => {
							const property =
								ressource[
									groupPropertyKey as keyof typeof ressource
								];
							conflictGroupObject =
								{
									...conflictGroupObject,
									[groupPropertyKey]:
										Array.isArray(
											property,
										)
											? property.map(
													(
														obj: StringIdexed<any>,
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
																	groupPropertyObject[
																		groupPropertyKey
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
														groupPropertyKey
													],
													[propertyKey]:
														property[
															propertyKey as string
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
