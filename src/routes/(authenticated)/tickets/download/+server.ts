import exceljs from 'exceljs';
import { prisma } from '$lib/prisma';

export const GET = async () => {
	const wb = new exceljs.Workbook();
	const ws = wb.addWorksheet('Sheet 1');

	ws.columns = [
		{ header: 'Ticket #', key: 'number', width: 10 },
		{ header: 'Item Number', key: 'itemNumber', width: 20 },
		{ header: 'Count', key: 'count', width: 10 }
	];

	const [tickets] = await Promise.all([prisma.ticket.findMany({ orderBy: [{ number: 'asc' }] })]);

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
