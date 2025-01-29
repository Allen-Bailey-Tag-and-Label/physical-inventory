import exceljs from 'exceljs';
import { prisma } from '$lib/prisma';
import { items } from '$stores/items/items';
import { DateTime } from 'luxon';

export const GET = async ({ locals }) => {
	const wb = new exceljs.Workbook();
	const ws = wb.addWorksheet('Sheet 1');

	ws.columns = [
		{ header: 'Ticket #', key: 'number', width: 10 },
		{ header: 'Item Number', key: 'itemNumber', width: 20 },
		{ header: 'Count', key: 'count', width: 10 },
		{ header: 'Date / Time', key: 'dateCreated', width: 20 },
		{ header: 'Is Valid Item Number?', key: 'isValidItemNumber', width: 25 }
	];

	const inventoryDate = DateTime.fromFormat(locals.INVENTORY_DATE, 'yyyy-MM-dd', {
		zone: 'America/New_York'
	}).toJSDate();
	let [tickets] = await Promise.all([
		prisma.ticket.findMany({ where: { inventoryDate }, orderBy: [{ number: 'asc' }] })
	]);

	tickets = tickets.map((ticket) => {
		const item = items.find((obj) => obj.itemNumber === ticket.itemNumber);
		const dateCreated = DateTime.fromJSDate(ticket.dateCreated).toFormat('M/d/yyyy h:mm a');
		const isValidItemNumber = item !== undefined && item !== null;
		return {
			...ticket,
			dateCreated,
			isValidItemNumber
		};
	});

	ws.addRows(tickets);

	const buffer = await wb.xlsx.writeBuffer();
	const uint8Array = new Uint8Array(buffer);

	return new Response(uint8Array, {
		headers: {
			'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'Content-Length': uint8Array.byteLength.toString()
		}
	});
};
