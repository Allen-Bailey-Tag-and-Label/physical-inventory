import { csv } from './csv';

const columnMap = new Map([
	['Branch/Plant', 'branch'],
	['Item Number', 'itemNumber'],
	['Description', 'description'],
	['Description 2', 'description2'],
	['Primary  UOM', 'uom'],
	['07', '07']
]);

const rows = csv
	.trim()
	.split('\n')
	.map((row) => row.split('\t'));

const headers = rows[0].map((column) => columnMap.get(column) ?? '');

const items = $state(
	rows
		.slice(1)
		.map((row) => {
			const object = row.reduce((object: Record<string, any>, value, index) => {
				object[headers[index]] = value.trim();

				return object;
			}, {});
			return object;
		})
		.filter((row) => row.branchId !== null)
);

export { items };
