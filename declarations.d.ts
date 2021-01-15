// This file allows you to use css modules
// Delete it if you don't need them

declare module '*.css' {
	const content: CSSStyleSheet;
	export default content;
}

declare module '*.scss' {
	const content: CSSStyleSheet;
	export default content;
}