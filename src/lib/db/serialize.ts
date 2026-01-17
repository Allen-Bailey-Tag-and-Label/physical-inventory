import { Types } from 'mongoose';

export const serialize = (value: any, seen = new WeakSet()): any => {
	// Primitives
	if (value === null || typeof value !== 'object') return value;

	// Mongo types
	if (value instanceof Types.ObjectId) return value.toString();
	if (value instanceof Date) return value.toISOString();

	// Circular reference guard
	if (seen.has(value)) return undefined;
	seen.add(value);

	// Arrays
	if (Array.isArray(value)) {
		return value.map((v) => serialize(v, seen));
	}

	// Plain objects
	return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, serialize(v, seen)]));
};
