import globalStyles from "~styles/global.scss";
import globalPageStyles from "~src/pages/global-styles.scss";

export const componentStyles = [globalStyles];
export const pageStyles = [globalStyles, globalPageStyles];

// This is a place for connecting to api or executing global scripts (like analytics)
// This file is marked as with side effects, which means that even functions, that are not imported
// by other components will always be executed if anything from this file is imported

initEnv();
function initEnv(): void {
    // Run global scripts
}
