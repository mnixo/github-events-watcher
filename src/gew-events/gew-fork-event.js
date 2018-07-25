import { html } from '@polymer/lit-element';
import { GewBaseEvent } from "./gew-base-event";

class GewForkEvent extends GewBaseEvent {

  _renderEventType(event) {
    return html`
      <div>
        <iron-image src="img/octoicons/repo-forked.svg"></iron-image>
        Forked the repository
      </div>
    `;
  }
}
window.customElements.define('gew-fork-event', GewForkEvent);
