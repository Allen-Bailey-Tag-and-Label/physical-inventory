export const formDataToMap = (formData: FormData) => {
	// initiate map
	const map: Map<string, string> = new Map();

	// loop over form data
	formData.forEach((value, key) => {
		map.set(key, value.toString());
	});

	return map;
};
