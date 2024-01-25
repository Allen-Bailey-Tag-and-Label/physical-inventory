import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const stored = browser ? localStorage.ticket : undefined;

const defaults = {
	count: '',
	itemNumber: '',
	number: '',
	shouldIncrementNumber: true,
	userCountId: '',
	userVerifyId: ''
};

export const ticket = writable(browser && stored !== undefined ? JSON.parse(stored) : defaults);

ticket.subscribe((value) => {
	if (browser) localStorage.ticket = JSON.stringify(value);
});
