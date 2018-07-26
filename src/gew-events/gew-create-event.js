import { html } from '@polymer/lit-element';
import { GewBaseEvent } from "./gew-base-event";

class GewCreateEvent extends GewBaseEvent {

  _getRefTypeIcon(refType) {
    // branch > git-branch
    // repo > repo
    // tag > tag
    return refType === 'branch' ? 'git-branch' : refType;
  }

  _getMessage(event) {
    const refType = event.payload.ref_type;
    const ref = event.payload.ref;
    if (refType === 'repo') {
      return html`Created the repository.`;
    }
    const href = refType === 'branch' ? this._getBranchUrl(event.repo, ref) : this._getTagUrl(event.repo, ref);
    return html`
      Created the ${refType}
      <a  href="${href}" target="_blank">
        <span class="mono bump-left bump-right">${ref}</span>
      </a>
      from
      <a  href="${this._getBranchUrl(event.repo, event.payload.master_branch)}" target="_blank">
        <span class="mono bump-left">${event.payload.master_branch}</span>
      </a>
    `;
  }

  _renderEventType(event) {
    const payload = event.payload;
    return html`
      <div>
        <iron-image src="img/octoicons/${this._getRefTypeIcon(payload.ref_type)}.svg"></iron-image>
        ${this._getMessage(event)}
      </div>
    `;
  }
}
window.customElements.define('gew-create-event', GewCreateEvent);
