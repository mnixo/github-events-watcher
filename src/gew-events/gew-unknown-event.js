import { html } from '@polymer/lit-element';
import { GewBaseEvent } from "./gew-base-event";

class GewUnknownEvent extends GewBaseEvent {

  _renderEventType(event) {
    return html`
      ${event.type}  
    `;
  }
}
window.customElements.define('gew-unknown-event', GewUnknownEvent);
