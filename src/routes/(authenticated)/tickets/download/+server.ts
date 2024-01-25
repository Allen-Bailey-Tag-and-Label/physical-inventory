import exceljs from 'exceljs';
import { prisma } from '$lib/prisma';
import { items } from '$stores/items/items';

export const GET = async () => {
	const wb = new exceljs.Workbook();
	const ws = wb.addWorksheet('Sheet 1');

	ws.columns = [
		{ header: 'Ticket #', key: 'number', width: 10 },
		{ header: 'Item Number', key: 'itemNumber', width: 20 },
		{ header: 'Count', key: 'count', width: 10 },
		{ header: 'Is Valid Item Number?', key: 'isValidItemNumber', width: 25 }
	];

	let [tickets] = await Promise.all([prisma.ticket.findMany({ orderBy: [{ number: 'asc' }] })]);

	tickets = tickets.map((ticket) => {
		const item = items.find((obj) => obj.itemNumber === ticket.itemNumber);
		const isValidItemNumber = item !== undefined && item !== null;
		return {
			...ticket,
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
