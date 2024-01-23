import { browser } from '$app/environment';
import { writable } from 'svelte/store';

type Item = {
	count: string;
	itemNumber: string;
	number: string;
	userCountId: string;
	userVerifyId: string;
};
const stored = browser ? localStorage.tickets : undefined;

const defaults: Item[] = [];

const { set, subscribe, update } = writable(
	browser && stored !== undefined ? JSON.parse(stored) : defaults
);

const add = (ticket: Item) => {
	update((state) => {
		state = [...state, { uploaded: false, ...ticket }];
		return state;
	});
};

export const tickets = { add, set, subscribe, update };

subscribe((value) => {
	if (browser) localStorage.tickets = JSON.stringify(value);
});
