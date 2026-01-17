type Options = {
	root?: Element | null;
	rootMargin?: string;
	threshold?: number;
};

export const intersectionObserver = (
	handler: (entries: IntersectionObserverEntry[], observer?: IntersectionObserver) => void,
	options: Options = {}
) => {
	return (element: Element) => {
		const observer = new IntersectionObserver(handler, {
			root: options?.root ?? null,
			rootMargin: options?.rootMargin ?? '0px',
			threshold: options?.threshold ?? 1
		});

		observer.observe(element);

		return () => {
			observer.unobserve(element);
			observer.disconnect();
		};
	};
};
