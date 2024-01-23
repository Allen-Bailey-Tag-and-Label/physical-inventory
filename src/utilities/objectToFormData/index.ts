export const objectToFormData = (obj: { [key: string]: any }) => {
	const formData = new FormData();
	Object.keys(obj).map((key) => {
		formData.append(key, obj[key]);
	});
	return formData;
};
