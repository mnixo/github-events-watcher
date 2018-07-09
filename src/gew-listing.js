import { LitElement, html } from '@polymer/lit-element';
import './gew-event';

class GewListing extends LitElement {
  static get properties() {
    return {
      events: Array,
    };
  }

  constructor() {
    super();
    this.events = [];
  }

  _render({ events }) {
    return html`
      <style>
        .container {
          display: flex;
          flex-direction: column;
          padding: 0.5em;
          overflow: auto;
        }
      </style>
      <div class="container">
        ${this._renderEventListing(events)}
      </div>
    `;
  }

  _renderEventListing(events) {
    return events.map(event => {
      return html`
        <gew-event event="${event}"></gew-event>
      `;
    })
  }
}
window.customElements.define('gew-listing', GewListing);
