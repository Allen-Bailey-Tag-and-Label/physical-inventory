import { INVENTORY_DATE } from '$env/static/private';
import { prisma } from '$lib/prisma/index.js';
import { items } from '$stores/items/items.js';

export const actions = {
	default: async () => {
		await prisma.ticket.deleteMany();
		const [onHand, users] = await Promise.all([
			prisma.onHand.findFirst({ where: { date: INVENTORY_DATE } }),
			prisma.user.findMany()
		]);
		const { fg: fgText, raw: rawText } = onHand;
		const fg = fgText
			.split('\r\n')
			.map((item) => item.split('\t'))
			.filter((item) => item[3] !== '0');
		const raw = rawText
			.split('\r\n')
			.map((item) => item.split('\t'))
			.filter((item) => item[6] !== '0');
		let number = 5000;
		for (let i = 0; i < fg.length; i++) {
			const cost07 = parseFloat(fg[i][11]);
			const dateCreated = new Date();
			const itemNumber = fg[i][0];
			const tickets = Math.ceil(Math.random() * 5);
			for (let j = 0; j < tickets; j++) {
				const userIndex = Math.floor(Math.random() * users.length);
				const userCountId = users[userIndex].id;
				const userVerifyId = users[(userIndex + 1) % users.length].id;
				const percent = Math.random() * 0.2 + 0.9 / tickets;
				const count = Math.floor(+fg[i][3] * percent);
				await prisma.ticket.create({
					data: {
						cost07,
						count,
						dateCreated,
						itemNumber,
						number,
						userCountId,
						userVerifyId
					}
				});
				console.log(`created ticket #${number}`);
				number++;
			}
		}
		for (let i = 0; i < raw.length; i++) {
			const cost07 = parseFloat(raw[i][5]);
			const dateCreated = new Date();
			const itemNumber = raw[i][0];
			const tickets = Math.ceil(Math.random() * 5);
			for (let j = 0; j < tickets; j++) {
				const userIndex = Math.floor(Math.random() * users.length);
				const userCountId = users[userIndex].id;
				const userVerifyId = users[(userIndex + 1) % users.length].id;
				const percent = Math.random() * 0.2 + 0.9 / tickets;
				const count = Math.floor(+raw[i][6] * percent);
				await prisma.ticket.create({
					data: {
						cost07,
						count,
						dateCreated,
						itemNumber,
						number,
						userCountId,
						userVerifyId
					}
				});
				console.log(`created ticket #${number}`);
				number++;
			}
		}
		return { success: true };
	}
};
