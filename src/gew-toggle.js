import { LitElement, html } from '@polymer/lit-element';

class GewToggle extends LitElement {
  static get properties() {
    return {
      disabled: Boolean,
    };
  }

  constructor() {
    super();
    this.disabled = true;
  }

  _render({ disabled }) {
    return html`
      <style>
        paper-toggle-button {
          --paper-toggle-button-checked-bar-color: #eee;
          --paper-toggle-button-checked-button-color: #eee;
          --paper-toggle-button-checked-ink-color: #eee;
          --paper-toggle-button-unchecked-bar-color: #aaa;
          --paper-toggle-button-unchecked-button-color: #aaa;
          --paper-toggle-button-unchecked-ink-color: #aaa;
        }
      </style>
      ${this._renderToggle(disabled)}
    `;
  }

  _renderToggle(disabled) {
    if (disabled) {
      return html`<paper-toggle-button disabled="true"></paper-toggle-button>`;
    }
    return html`<paper-toggle-button></paper-toggle-button>`;
  }
}
window.customElements.define('gew-toggle', GewToggle);
