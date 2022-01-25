import { CSSResultGroup, html, LitElement, TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { pageStyles } from "~src/global";
import { getUsername } from "~services/name-service";
import scopedStyles from "./styles.module.scss";

import("~components/hello-text").then(f => f.default());

@customElement("test-page")
export default class TestPage extends LitElement {
    @state() username: string | null = null;

    render(): TemplateResult {
      return html`
      <div class="container">
        <hello-text sub="Welcome User">${this.username}</hello-text>
      </div>
    `;
    }

    connectedCallback(): void {
      super.connectedCallback();
      this.username = getUsername();
    }

    static get styles(): CSSResultGroup {
      return [...pageStyles, scopedStyles as never];
    }
}
