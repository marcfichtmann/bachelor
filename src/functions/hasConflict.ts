import {
	Config,
	Patch,
} from "../types/common";
import { createHashableObject } from "./createConflictHashObject";
import {
	getConflictGroups,
	getUpdatedDataGroups,
} from "./getConflictGroup";

export function hasConflict<
	TResourceTypes extends string,
	TResource,
>(
	patch: string,
	currentState: TResource,
	configuration: Config<TResourceTypes>[TResourceTypes],
): boolean {
	const currentStateHashes =
		createHashableObject(
			currentState,
			configuration,
		);
	const patchObj: Patch<TResource> =
		JSON.parse(patch);
	if (
		patchObj.hashes ===
		currentStateHashes
	) {
		return false;
	} else {
		const conflictGroups =
			getConflictGroups(
				patchObj.hashes,
				currentStateHashes,
			);
		const updatedDataGroups =
			getUpdatedDataGroups(
				patchObj.data,
				configuration,
			);
		return hasSameGroup(
			conflictGroups,
			updatedDataGroups,
		);
	}
}

function hasSameGroup(
	a: string[],
	b: string[],
): boolean {
	let includes = false;
	a.forEach((value) => {
		if (b.includes(value)) {
			includes = true;
			return;
		}
	});
	return includes;
}

function checkConfiguration() {}
