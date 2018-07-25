import { html } from '@polymer/lit-element';
import { GewBaseEvent } from "./gew-base-event";
import { pluralize } from "../util";

class GewPushEvent extends GewBaseEvent {

  _getBranchUrl(repo, branch) {
    return `https://github.com/${repo.name}/tree/${branch}`;
  }

  _getCommitUrl(repo, commit) {
    return `https://github.com/${repo.name}/commit/${commit.sha}`;
  }

  _handleCommit(repo, commit) {
    // split the first line if there is more than one
    let message = commit.message.includes('\n') ? commit.message.split('\n')[0] : commit.message;
    // split the message if it is too long
    message = message.length > 100 ? `${message.substring(0, 100)}...` : message;
    const sha = commit.sha.substring(0, 7);
    const commitUrl = this._getCommitUrl(repo, commit);
    return html`
      <iron-image src="img/octoicons/git-commit.svg"></iron-image>
      <a href="${commitUrl}" target="_blank" class="bump-right">
        <span class="mono">${sha}</span>
      </a>
      <a href="${commitUrl}" target="_blank" class=" bump-right bump-left">
        <span class="mono">${message}</span>
      </a>
      ${commit.author.name}
    `;
  }

  _renderEventType(event) {
    const payload = event.payload;
    const commits = payload.commits.map(commit => {
      return html`
          <div>${this._handleCommit(event.repo, commit)}</div>
        `;
    });
    const branch = payload.ref.replace('refs/heads/', '');
    return html`
      <div>
        <iron-image src="img/octoicons/repo-push.svg"></iron-image>
        Pushed ${payload.commits.length} ${pluralize('commit', 'commits', payload.commits.length)} to 
        <a href="${this._getBranchUrl(event.repo, branch)}" target="_blank" class="bump-left">
          <span class="mono">${branch}</span>
        </a>
      </div>
      ${commits}
    `;
  }
}
window.customElements.define('gew-push-event', GewPushEvent);
