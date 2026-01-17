export const clickOutside = (callback: () => any) => {
	return (element: Element) => {
		const clickHandler = (event: Event) => {
			const target = event.target as Node | null;
			if (target && !element.contains(target)) {
				callback();
			}
		};

		document.addEventListener('click', clickHandler, true);

		return () => {
			document.removeEventListener('click', clickHandler, true);
		};
	};
};
