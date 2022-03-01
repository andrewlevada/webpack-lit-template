# Lit Webpack Project Starter

This project can be used as starting point for creating a full multipage application with Lit. It also uses Typescript, Webpack and SCSS.

Fell free to clone it and start your project with bundle build configuration what works like a charm out of the box.

## Structure

Folders and files in this project: 
1. `/src/pages` - all pages are stored here as top level components (it's recommended to add postfix `page` to every component's name in this folder). Webpack will generate html file for every mapped *(read later about this)* file from this folder and place page component in body.
2. `/src/pages/base.html` - base html file used for page generation (add `<link>` and `<script>` tags here)
3. `/src/components` - all other components in the project (not pages)
4. `/src/services` - place for logic (requests to api, algorithms, etc.)
5. `/src/utils` - place for useful function that can be used anywhere in project
6. `/src/assets/styles` - global styles (theming, layouts, mixins, etc.) - it's recommended to split global styles in different files here because tree-shaking will only remove entire files (not parts of files)
7. `/src/assets/to-root` - on build contents from this folder are copied to the root of the build (useful for files like robots.txt and favicon.ico)
8. `/src/global.ts` - contains global variables, styles for all components/pages and globally executed scripts, for example analytics
9. `/router.js` - this file is used to map urls to top level components (pages). Don't forget to change it each time you add a page or remove one.

## Setup

Install dependencies:

```bash
npm i
```

Don't forget to change name of the project in `package.json`!

## Build

In this repo TypeScript compiler is used to produce JavaScript that runs in modern browsers. 
Also, ESLint is used along with it - they are executed in fix mode before every build.
So, you might want to configure linting rules in `.eslintrc.js` to make them fit your code style.

To build full app bundle (output files will be in _build_ folder) run:

```bash
npm run build
```

You can also generate build and _stats.json_ file, that can later be used for bundle analysis ([this tool](https://alexkuz.github.io/webpack-chart/) is my favourite):

```bash
npm run build:stats
```

## Dev Server

To start the dev server run (by default on _localhost:2797_):

```bash
npm run start:dev
```
