import { html } from '@polymer/lit-element';
import { GewBaseEvent } from "./gew-base-event";

class GewWatchEvent extends GewBaseEvent {

  _renderEventType(event) {
    return html`
      <div>
        <iron-image src="img/octoicons/eye.svg"></iron-image>
        Watching the repository
      </div>
    `;
  }
}
window.customElements.define('gew-watch-event', GewWatchEvent);
