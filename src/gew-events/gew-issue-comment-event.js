import { html } from '@polymer/lit-element';
import { GewBaseEvent } from "./gew-base-event";
import { replaceGitHubEmoji } from "../util";

class GewIssueCommentEvent extends GewBaseEvent {

  _renderEventType(event) {
    const payload = event.payload;
    return html`
      <div>
        <iron-image src="img/octoicons/comment.svg"></iron-image>
        Commented on
        <a href="${payload.issue.html_url}" target="_blank" class="bump-left">
          <span class="mono">${payload.issue.title}</span>
        </a>
      </div>
      <div class="italic">
        <a href="${payload.comment.html_url}" target="_blank">
          "${replaceGitHubEmoji(payload.comment.body)}"
        </a>
      </div>
    `;
  }
}
window.customElements.define('gew-issue-comment-event', GewIssueCommentEvent);
