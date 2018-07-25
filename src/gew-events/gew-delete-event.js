import { html } from '@polymer/lit-element';
import { GewBaseEvent } from "./gew-base-event";

class GewDeleteEvent extends GewBaseEvent {

  _renderEventType(event) {
    const payload = event.payload;
    return html`
      <div>
        <iron-image src="img/octoicons/trashcan.svg"></iron-image>
        Deleted <span class="mono bump-left">${payload.ref_type}</span> <span class="mono bump-left">${payload.ref}</span>
      </div>
    `;
  }
}
window.customElements.define('gew-delete-event', GewDeleteEvent);
