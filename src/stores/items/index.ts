import { writable } from 'svelte/store';
import { items as itemsArray } from './items';

export const items = writable(itemsArray);
