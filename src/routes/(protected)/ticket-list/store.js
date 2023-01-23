import { writable } from 'svelte/store';

export default writable({
  sortBy: 'ticketNumber',
  sortDirection: 1
});
