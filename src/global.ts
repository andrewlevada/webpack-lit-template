import axios from "axios";
import globalStyles from "~styles/global.scss";
import globalPageStyles from "~src/pages/global-styles.scss";
import env from "~src/env";

export const server = axios.create();
export const componentStyles = [globalStyles];
export const pageStyles = [globalStyles, globalPageStyles];

initEnv();
export function initEnv(): void {
  server.defaults.baseURL = env.apiUrl;
}
