import { html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { componentStyles } from "~src/global";
import scopedStyles from "./styles.module.scss";

@customElement("hello-text")
export default class HelloText extends LitElement {
  @property({ type: String }) sub!: string;

  render(): TemplateResult {
    return html`
      <h4>Hello, <slot></slot></h4>
      <p>${this.sub}</p>
    `;
  }

  static get styles(): CSSStyleSheet[] {
    return [...componentStyles, scopedStyles as never];
  }
}
