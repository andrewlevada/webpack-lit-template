// This part allows you to use css logic
// Delete it if you don't need them

declare module '*.css' {
	const content: CSSStyleSheet;
	export default content;
}

declare module '*.scss' {
	const content: CSSStyleSheet;
	export default content;
}

// This part allows you to localize your app

declare module "*.locale.json" {
	const content: Iterable<[string, string]>;
	export default content;
}

// This part allows you to reference images from scripts

declare module "*.png";
declare module "*.jpg";
declare module "*.svg";