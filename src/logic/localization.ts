const defaultLocaleCode = "en";
const validLocaleCodes = ["en", "ru"];

export default class Localization {
	private static localeCode : string | undefined;
	private static locale : Map<string, string> | undefined;
	private static localizeCallbacks : any[] = [];

	public static onLocalized(callback : () => void) : void {
		if (!this.locale) {
			// If this is a very first call of this
			if (this.localizeCallbacks.length === 0) this.initialize();

			this.localizeCallbacks.push(callback);
		} else callback();
	}

	/**
	 * Returns mapped localized value. Must be called only in onLocalized callback
	 */
	public static get(code : string) : string {
		if (this.locale) return this.locale.get(code) || "";
		else return "";
	}

	public static localizeDefaultLocaleLink(original : string) : string {
		if (!this.localeCode) this.detectLocale();
		if (this.localeCode === defaultLocaleCode) return original;
		else return `/${(this.localeCode)}${original}`;
	}

	public static detectLocale() : string {
		// If already detected
		if (this.localeCode) return this.localeCode;

		// Detect language set in url
		const path = window.location.pathname;
		let urlRegex : RegExpMatchArray | string[] | null = path.match(/^\/(.{2})\//);
		if (path.length === 3) urlRegex = ["", path.substr(1)];
		if (urlRegex && urlRegex[1] && validLocaleCodes.includes(urlRegex[1])) {
			if (urlRegex[1] === defaultLocaleCode) {
				this.redirectToLocalizedPage(defaultLocaleCode);
				return defaultLocaleCode;
			}

			this.localeCode = urlRegex[1];
			return urlRegex[1];
		}

		// Detect language set in browser
		const browserLocale = window.navigator.language.substr(0, 2) || defaultLocaleCode;
		if (!validLocaleCodes.includes(browserLocale) || browserLocale === defaultLocaleCode) {
			this.localeCode = defaultLocaleCode;
			return defaultLocaleCode;
		}

		this.redirectToLocalizedPage(browserLocale);
		return browserLocale;
	}

	private static initialize() {
		import(`../../locales/${this.detectLocale()}.locale.json`).then((loaded) => {
			this.locale = new Map(loaded.default);
			this.localizeCallbacks.forEach(callback => callback());
			this.localizeCallbacks = [];
		});
	}

	private static redirectToLocalizedPage(newLocale : string) : void {
		const loc : Location = window.location;
		const path : string = loc.pathname;

		window.location.assign(`${loc.protocol}//${loc.host}${
			newLocale === defaultLocaleCode ? "" : ("/" + newLocale)}${
			path.match(/\/..\//) ? path.substr(3) : path}${
			loc.search.length > 1 ? loc.search : ""}${
			loc.hash.length > 1 ? loc.hash : ""}`);
	}
}