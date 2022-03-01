// This file is used for mapping urls to top level components (pages)
// Don't forget to change it each time you add a page or remove one
//
// Explanation on each field:
//
// source - path from /src/pages to directory with file named index.ts
// which will be used as page component. By default, source is also url
// at which this page will be displayed
//
// title - contents of <title> tag for this page
// description - (optional) same for <description> tag
//
// outputPath - (optional) overrides url set from source

module.exports = [
    // Here outputPath is optional
    // If it's not set, output will be the same as source
    { source: "/test", title: "Test page", outputPath: "/" },
];
