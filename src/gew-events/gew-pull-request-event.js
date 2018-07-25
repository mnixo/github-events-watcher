import { html } from '@polymer/lit-element';
import { GewBaseEvent } from "./gew-base-event";

class GewPullRequestEvent extends GewBaseEvent {

  _renderEventType(event) {
    const payload = event.payload;
    return html`
      <div>
        <iron-image src="img/octoicons/git-pull-request.svg"></iron-image>
        Pull Request ${payload.action}:
        <a href="${payload.pull_request.html_url}" target="_blank" class="bump-left">
          <span class="mono">${payload.pull_request.title}</span>
        </a>
      </div>
    `;
  }
}
window.customElements.define('gew-pull-request-event', GewPullRequestEvent);
