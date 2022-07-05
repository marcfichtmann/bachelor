import {
	Resource,
	Config,
	ResourceTypes,
	Patch,
} from "../types/domainModel";
import { createHashableObject } from "./createConflictHashObject";
import {
	getConflictGroups,
	getUpdatedDataGroups,
} from "./getConflictGroup";

export function hasConflict(
	patch: string,
	currentState: Resource,
	configuration: Config[ResourceTypes],
): boolean {
	const currentStateHashes =
		createHashableObject(
			currentState,
			configuration,
		);
	const patchObj: Patch<Resource> =
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
