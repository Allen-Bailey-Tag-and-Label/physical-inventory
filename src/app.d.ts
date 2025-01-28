// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			INVENTORY_DATE: string;
			user: {
				firstName: string;
				isAdmin: boolean;
				lastName: string;
				username: string;
			};
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
