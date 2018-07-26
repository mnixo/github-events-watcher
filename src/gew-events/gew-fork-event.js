import { html } from '@polymer/lit-element';
import { GewBaseEvent } from "./gew-base-event";

class GewForkEvent extends GewBaseEvent {

  _renderEventType(event) {
    return html`
      <div>
        <iron-image src="img/octoicons/repo-forked.svg"></iron-image>
        <a  href="${event.payload.forkee.html_url}" target="_blank">
          Forked the repository
        </a>
      </div>
    `;
  }
}
window.customElements.define('gew-fork-event', GewForkEvent);
