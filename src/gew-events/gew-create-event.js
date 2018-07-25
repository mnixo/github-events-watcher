import { html } from '@polymer/lit-element';
import { GewBaseEvent } from "./gew-base-event";

class GewCreateEvent extends GewBaseEvent {

  _getRefTypeIcon(refType) {
    if (refType === 'tag') {
      return 'tag';
    } else if (refType === 'branch') {
      return 'git-branch';
    }
    return 'plus';
  }

  _renderEventType(event) {
    const payload = event.payload;
    // https://developer.github.com/v3/activity/events/types/#createevent
    // handle each of the 3 types correctly (icons, links, etc)
    return html`
      <div>
        <iron-image src="img/octoicons/${this._getRefTypeIcon(payload.ref_type)}.svg"></iron-image>
        Created
        <span class="mono bump-left">${payload.ref_type}</span>
        <span class="mono bump-left">${payload.ref}</span>
      </div>
    `;
  }
}
window.customElements.define('gew-create-event', GewCreateEvent);
