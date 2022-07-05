import {
	Config,
	StringIdexed,
} from "../types/common";

export function createHashableObject<
	TResourceTypes extends string,
	TResource,
>(
	ressource: TResource,
	config: Config<TResourceTypes>[TResourceTypes],
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
															indexProperty as string
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
