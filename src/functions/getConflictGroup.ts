import {
	Config,
	StringIdexed,
} from "../types/common";

export function getConflictGroups(
	patch: StringIdexed<string>,
	currentState: StringIdexed<string>,
): string[] {
	let conflictGroups: string[] =
		[];
	Object.keys(patch).forEach(
		(etagGroup) => {
			const patchEtags =
				JSON.stringify(
					patch[etagGroup],
				);
			const currentEtags =
				JSON.stringify(
					currentState[
						etagGroup
					],
				);
			if (
				patchEtags &&
				currentEtags &&
				patchEtags !==
					currentEtags
			) {
				conflictGroups.push(
					etagGroup,
				);
			}
		},
	);
	return conflictGroups;
}

export function getUpdatedDataGroups<
	TResourceTypes extends string,
	TResource,
>(
	patch: Partial<TResource>,
	configuration: Config<TResourceTypes>[TResourceTypes],
): string[] {
	const patchKeys =
		Object.keys(patch);
	const conflictGroups =
		configuration.conflictGroups;
	let updatedDataGroups: string[] =
		[];

	conflictGroups.forEach(
		(group) => {
			patchKeys.forEach(
				(patchKey) => {
					const patchProperty =
						patch[
							patchKey as keyof typeof patch
						];
					const isPatchPropertyArray =
						Array.isArray(
							patchProperty,
						);
					if (
						isPatchPropertyArray
					) {
						patchProperty.forEach(
							(obj) => {
								group.properties.forEach(
									(
										groupProperty,
									) => {
										Object.keys(
											obj,
										).forEach(
											(
												objProperty,
											) => {
												if (
													typeof groupProperty !==
														"string" &&
													groupProperty[
														patchKey
													].includes(
														objProperty,
													) &&
													!updatedDataGroups.includes(
														group.name,
													)
												) {
													updatedDataGroups.push(
														group.name,
													);
													return;
												}
											},
										);
									},
								);
							},
						);
					} else {
						if (
							group.properties.includes(
								patchKey,
							)
						) {
							updatedDataGroups.push(
								group.name,
							);
						}
					}
				},
			);
		},
	);
	return updatedDataGroups;
}
