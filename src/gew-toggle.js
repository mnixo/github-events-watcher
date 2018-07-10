import { LitElement, html } from '@polymer/lit-element';

class GewToggle extends LitElement {
  static get properties() {
    return {

    };
  }

  constructor() {
    super();
  }

  _render(props) {
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
      <paper-toggle-button id="toggle" on-change="${this._onChange.bind(this)}"></paper-toggle-button>
    `;
  }

  _onChange() {
    this.dispatchEvent(new CustomEvent('toggle', {
      detail: {
        checked: this.shadowRoot.getElementById('toggle').checked,
      }
    }));
  }
}
window.customElements.define('gew-toggle', GewToggle);
