import { default as defaultTheme } from '$lib/themes';
import { twMerge } from 'tailwind-merge';

class Theme {
	_state: Record<string, Record<string, string>>;

	constructor(themeObject: Record<string, Record<string, string>>) {
		this._state = $state(themeObject);
	}

	get() {
		return this._state;
	}
	getComponent(component: string) {
		return this._state?.[component];
	}
	getComponentVariant(component: string, variant: string) {
		return this._state?.[component]?.[variant];
	}

	set(themeObject: Record<string, Record<string, string>>) {
		this._state = themeObject;
	}
	setComponent(component: string, componentObject: Record<string, string>) {
		this._state[component] = componentObject;
	}
	setComponentVariant(component: string, variant: string, variantValue: string) {
		if (this._state?.[component] === undefined) this._state[component] = {};
		this._state[component][variant] = variantValue;
	}

	update(themeObject: Record<string, Record<string, string>>) {
		Object.keys(themeObject).forEach((component) => {
			if (this._state?.[component] === undefined) this._state[component] = {};
			Object.keys(themeObject[component]).forEach((variant) => {
				if (this._state[component]?.[variant] === undefined) this._state[component][variant] = '';
				this._state[component][variant] = twMerge(
					this._state[component][variant],
					themeObject[component][variant]
				);
			});
		});
	}
	updateComponent(component: string, componentObject: Record<string, string>) {
		if (this._state?.[component] === undefined) this._state[component] = {};
		Object.keys(componentObject).forEach((variant) => {
			if (this._state[component]?.[variant] === undefined) this._state[component][variant] = '';
			this._state[component][variant] = twMerge(
				this._state[component][variant],
				componentObject[variant]
			);
		});
	}
	updateComponentVariant(component: string, variant: string, variantValue: string) {
		if (this._state?.[component] === undefined) this._state[component] = {};
		if (this._state[component]?.[variant] === undefined) this._state[component][variant] = '';
		this._state[component][variant] = twMerge(this._state[component][variant], variantValue);
	}
}

export const theme = new Theme(defaultTheme);
