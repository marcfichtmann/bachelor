import md5 from "md5";
import { createHashableObject } from "../functions/createConflictHashObject";
import {
	Resources,
	config,
	ResourceTypes,
	Patch,
	Resource,
	Config,
} from "../types/domainModel";

import { mockData } from "./MockData";

export class ApiService {
	private data: Resources =
		mockData;

	constructor() {
		this.initEtags();
	}

	initEtags() {
		this.data.group =
			this.data.group.map(
				(group) => ({
					...group,
					etags:
						createHashableObject(
							group,
							config.group,
						),
				}),
			);
		this.data.user =
			this.data.user.map(
				(user) => ({
					...user,
					etags:
						createHashableObject(
							user,
							config.user,
						),
				}),
			);
	}

	updateData(
		resourceType: ResourceTypes,
		publicId: string,
		updateData: Patch<Resource>,
	) {
		const resource: Resource[] =
			this.data[resourceType];
		let couldUpdate = false;
		resource.forEach(
			(data) => {
				if (
					data.publicId ===
					publicId
				) {
					if (
						true
						// isAllowed(
						// 	updateData,
						// 	data,
						// 	config[
						// 		resourceType
						// 	],
						// )
					) {
						Object.keys(
							updateData.data,
						).forEach(
							(key) =>
								(data[
									key as keyof Omit<
										Resource,
										"etags"
									>
								] =
									updateData
										.data[
										key as keyof Omit<
											Resource,
											"etags"
										>
									] || ""),
						);
						// data.etags =
						// 	createHashableObject(
						// 		data,
						// 		config[
						// 			resourceType
						// 		],
						// 	);
						couldUpdate =
							true;
					}
				}
			},
		);
		return couldUpdate;
	}

	getResource(
		resourceType: ResourceTypes,
		publicId: string,
	): Resource | undefined {
		const resource =
			this.data[resourceType];
		let resourceData:
			| Resource
			| undefined;
		resource.forEach(
			(data) => {
				if (
					data.publicId ===
					publicId
				) {
					resourceData = data;
				}
			},
		);
		return {
			...resourceData,
		} as Resource | undefined;
	}
}

function hashObject(object: {
	[key: string]: any;
}): string {
	return md5(
		JSON.stringify(object),
	);
}
