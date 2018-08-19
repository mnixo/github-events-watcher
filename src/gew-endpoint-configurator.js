import { LitElement, html } from '@polymer/lit-element';
import '@polymer/paper-button/paper-button';

class GewEndpointConfigurator extends LitElement {
  static get properties() {
    return {
      endpoints: Array,
    };
  }

  constructor() {
    super();
    this.endpoints = ['one', 'two', 'three'];
  }

  _render({ endpoints }) {
    return html`
      <div>Endpoint Configuration</div>
      <paper-button>Add Endpoint</paper-button>
      ${this._renderItems(endpoints)}
    `;
  }

  _renderItems(endpoints) {
    return endpoints.map(endpoint => {
      return html`
        <div>${endpoint}</div>
      `;
    });
  }
}
window.customElements.define('gew-endpoint-configurator', GewEndpointConfigurator);
