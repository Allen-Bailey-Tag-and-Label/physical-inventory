import { csv } from './csv';

const itemKeys = [
	'branch',
	'stockingType',
	'lineType',
	'itemNumber',
	'description',
	'description2',
	'searchText',
	'salesCode1',
	'salesCode2',
	'salesCode3',
	'salesCode4',
	'salesCode5',
	'purchCode1',
	'purchCode2',
	'purchCode3',
	'planFmly',
	'costRule',
	'buyerNumber',
	'plannerNumber',
	'supplierNumber',
	'itemFlashMessage',
	'thirdItemNumber',
	'shortItemNo',
	'itemClass',
	'groupWarehouseProcess1',
	'groupWarehouseProcess2',
	'groupWarehouseProcess3',
	'categoryCode8',
	'categoryCode10'
];

const rows = csv
	.trim()
	.split('\n')
	.map((row) => row.split('\t'));

const items = $state(
	rows
		.slice(1)
		.map((row) => {
			const object = row.reduce((object: Record<string, any>, value, index) => {
				object[itemKeys[index]] = value.trim();

				return object;
			}, {});
			return object;
		})
		.filter((row) => row.branchId !== null)
);

export { items };
