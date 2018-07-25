import { html } from '@polymer/lit-element';
import { GewBaseEvent } from "./gew-base-event";

class GewErrorEvent extends GewBaseEvent {

  _renderEventType(event) {
    return html`
      <div>Error</div>
      <div class="mono">${event.responseText}</div>
    `;
  }
}
window.customElements.define('gew-error-event', GewErrorEvent);
