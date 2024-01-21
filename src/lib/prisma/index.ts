import { Prisma, PrismaClient } from '@prisma/client';

export const getSchema = (modelName: string) => {
	const schema = Prisma.dmmf.datamodel.models
		.find((model) => model.name === modelName)
		?.fields?.reduce((obj: { [key: string]: any }, field) => {
			obj[field.name] = field;
			return obj;
		}, {});

	return schema;
};

export const prisma = new PrismaClient();
