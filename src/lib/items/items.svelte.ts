import { csv } from './csv';

const columnMap = new Map([
	['Branch/Plant', { isHidden: false, isUom: false, key: 'branch' }],
	['Item Number', { isHidden: false, isUom: false, key: 'itemNumber' }],
	['Description', { isHidden: false, isUom: false, key: 'description' }],
	['Description 2', { isHidden: false, isUom: false, key: 'description2' }],
	['Primary  UOM', { isHidden: false, isUom: true, key: 'uom' }],
	['07', { isHidden: false, isUom: false, key: '07' }],
	['FT to Primary', { isHidden: true, isUom: true, key: 'FT' }],
	['RL to Primary', { isHidden: true, isUom: true, key: 'RL' }],
	['CA to Primary', { isHidden: true, isUom: true, key: 'CA' }]
]);

const rows = csv
	.trim()
	.split('\n')
	.map((row) => row.split('\t'));

const headers = rows[0].map(
	(column) => columnMap.get(column) ?? { isHidden: true, isUom: false, key: '' }
);

const items = $state<Record<string, any>[]>([]);
const itemsMap = $state<
	Map<
		string,
		{
			branch: string;
			description: string;
			description2: string;
			itemNumber: string;
			uom: string;
			'07': string;
			conversionFactors: Record<string, number>;
		}
	>
>(new Map());

rows.slice(1).forEach((row) => {
	// @ts-ignore
	const object: {
		branch: string;
		description: string;
		description2: string;
		itemNumber: string;
		uom: string;
		'07': string;
		conversionFactors: Record<string, number>;
	} = { conversionFactors: {} };

	row.forEach((value, index) => {
		const { isUom, key } = headers[index];
		// @ts-ignore
		object[key] = value.trim();

		if (isUom) {
			if (key === 'uom') object.conversionFactors[value.trim()] = 1;
			if (key !== 'uom' && value.trim() !== '')
				object.conversionFactors[key] = parseFloat(value.trim());
		}
	});

	items.push(object);
	itemsMap.set(object.itemNumber, object);
});

export { items, itemsMap };
