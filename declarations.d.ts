// This part allows you to use css modules
// Delete it if you don't need them

declare module "*.css" {
  const content: CSSStyleSheet;
  export default content;
}

declare module "*.scss" {
  const content: CSSStyleSheet;
  export default content;
}

// This part allows you to reference images from scripts

declare module "*.png";
declare module "*.jpg";
declare module "*.svg";

// Global variable managed by webpack
declare const PRODUCTION: boolean;
