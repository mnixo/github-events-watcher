import { html } from '@polymer/lit-element';
import { GewBaseEvent } from "./gew-base-event";

class GewReleaseEvent extends GewBaseEvent {

  _renderEventType(event) {
    const payload = event.payload;
    return html`
      <div>
        <iron-image src="img/octoicons/tag.svg"></iron-image>
        Release <span class="mono bump-left bump-right">${payload.release.tag_name}</span> ${payload.action}
      </div>
    `;
  }
}
window.customElements.define('gew-release-event', GewReleaseEvent);
