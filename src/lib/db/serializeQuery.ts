export const serializeQuery = <T>(query: Promise<T>): Promise<Awaited<T>> =>
	query.then((result) => JSON.parse(JSON.stringify(result)));
