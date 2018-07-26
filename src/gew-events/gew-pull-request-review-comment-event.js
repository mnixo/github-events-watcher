import { html } from '@polymer/lit-element';
import { GewBaseEvent } from "./gew-base-event";
import { replaceGitHubEmoji } from "../util";

class GewPullRequestReviewCommentEvent extends GewBaseEvent {

  _renderEventType(event) {
    const payload = event.payload;
    return html`
      <div>
        <iron-image src="img/octoicons/comment.svg"></iron-image>
        Commented on
        <a href="${payload.pull_request.html_url}" target="_blank" class="bump-left">
          <span class="mono">${payload.pull_request.title}</span>
        </a>
      </div>
      <span class="code">${payload.comment.diff_hunk}</span>
      <div class="italic">
        <a href="${payload.comment.html_url}" target="_blank">
          "${replaceGitHubEmoji(payload.comment.body)}"
        </a>
      </div>
    `;
  }
}
window.customElements.define('gew-pull-request-review-comment-event', GewPullRequestReviewCommentEvent);
