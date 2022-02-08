import { html, LitElement, TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { componentStyles } from "~src/global";
import { defineComponent } from "~utils/components";
import scopedStyles from "./styles.module.scss";

export default (): void => defineComponent("hello-text", HelloText);
export class HelloText extends LitElement {
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
