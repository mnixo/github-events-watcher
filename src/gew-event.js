import '@polymer/iron-image/iron-image';
import { LitElement, html } from '@polymer/lit-element';
import '@polymer/paper-card/paper-card';
import { pluralize, replaceGitHubEmoji, timeAgo } from "./util";

class GewEvent extends LitElement {
  static get properties() {
    return {
      event: Object,
    };
  }

  constructor() {
    super();
    this.event = null;
  }

  _render({ event }) {
    if (!event) {
      return;
    }
    console.log(event);
    return html`
      <style>
        paper-card {
          display: flex;
          margin-bottom: 0.5em;
          padding: 0.5em;
          font-size: 14px;
        }
        iron-image {
          border-radius: 4px;
          margin-right: 0.5em;
        }
        a {
          color: inherit;
          text-decoration: inherit;
        }
        a:hover {
          color: -webkit-link;
          text-decoration: underline;
        }
        .container-details > div {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          margin: 0.1em 0;
        }
        .italic {
          font-style: italic;
        }
        .mono {
          font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
          font-size: 12px;
          border-radius: 2px;
          background-color: #eee;
          padding: 0 0.2em;
          white-space: pre-wrap;
        }
        .bump-left {
          margin-left: 0.2em;
        }
        .bump-right {
          margin-right: 0.2em;
        }
      </style>
      <paper-card>
        <div>
          ${this._renderEventActorAvatar(event)}
        </div>
        <div class="container-details">
          ${this._renderEventActor(event)}
          ${this._renderEventType(event)}
        </div>
      </paper-card>
    `;
  }

  _renderEventActorAvatar(event) {
    if (!event.actor) {
      return null;
    }
    return html`
      <a href="${this._getActorUrl(event.actor)}" target="_blank">
        <iron-image src="${event.actor.avatar_url}" width="48" height="48" sizing="contain"></iron-image>
      </a>
    `;
  }

  _renderEventActor(event) {
    if (!event.actor) {
      return null;
    }
    return html`
      <div>
        <a href="${this._getActorUrl(event.actor)}" target="_blank" class="bump-right">
          ${event.actor.login}
        </a>
        in
        <a href="${this._getRepoUrl(event.repo)}" target="_blank" class="bump-left bump-right">
          <span class="mono">${event.repo.name}</span>
        </a>
        (${this._renderDate(event.created_at)}) 
      </div>
    `;
  }

  _renderDate(dateString) {
    return timeAgo(new Date() - new Date(dateString));
  }

  _renderEventType(event) {
    const payload = event.payload;
    if (event.type === 'PushEvent') {
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
    } else if (event.type === 'CreateEvent') {
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
    } else if (event.type === 'DeleteEvent') {
      return html`
        <div>
          <iron-image src="img/octoicons/trashcan.svg"></iron-image>
          Deleted <span class="mono bump-left">${payload.ref_type}</span> <span class="mono bump-left">${payload.ref}</span>
        </div>
      `;
    } else if (event.type === 'IssueCommentEvent'){
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
    } else if (event.type === 'IssuesEvent'){
      return html`
        <div>
          <iron-image src="img/octoicons/issue-opened.svg"></iron-image>
          Issue ${payload.action}:
          <a href="${payload.issue.html_url}" target="_blank" class="bump-left">
            <span class="mono">${payload.issue.title}</span>
          </a>
        </div>
      `;
    } else if (event.type === 'PullRequestReviewCommentEvent'){
      return html`
        <div>
          <iron-image src="img/octoicons/comment.svg"></iron-image>
          Commented on
          <a href="${payload.pull_request.html_url}" target="_blank" class="bump-left">
            <span class="mono">${payload.pull_request.title}</span>
          </a>
        </div>
        <div class="italic">
          <a href="${payload.comment.html_url}" target="_blank">
            "${replaceGitHubEmoji(payload.comment.body)}"
          </a>
        </div>
      `;
    } else if (event.type === 'PullRequestEvent') {
      return html`
        <div>
          <iron-image src="img/octoicons/git-pull-request.svg"></iron-image>
          Pull Request ${payload.action}:
          <a href="${payload.pull_request.html_url}" target="_blank" class="bump-left">
            <span class="mono">${payload.pull_request.title}</span>
          </a>
        </div>
      `;
    } else if (event.type === 'ForkEvent') {
      return html`
        <div>
          <iron-image src="img/octoicons/repo-forked.svg"></iron-image>
          Forked the repository
        </div>
      `;
    } else if (event.type === 'WatchEvent') {
      return html`
        <div>
          <iron-image src="img/octoicons/eye.svg"></iron-image>
          Watching the repository
        </div>
      `;
    } else if (event.type === 'ReleaseEvent') {
      return html`
        <div>
          <iron-image src="img/octoicons/tag.svg"></iron-image>
          Release <span class="mono bump-left bump-right">${payload.release.tag_name}</span> ${payload.action}
        </div>
      `;
    } else if (event.type === 'ErrorEvent') {
      return html`
        <div>Error</div>
        <div class="mono">${event.responseText}</div>
      `;
    } else {
      return event.type;
    }
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

  _getRefTypeIcon(refType) {
    if (refType === 'tag') {
      return 'tag';
    } else if (refType === 'branch') {
      return 'git-branch';
    }
    return 'plus';
  }

  _getActorUrl(actor) {
    return `https://github.com/${actor.login}`;
  }

  _getRepoUrl(repo) {
    return `https://github.com/${repo.name}`;
  }

  _getBranchUrl(repo, branch) {
    return `https://github.com/${repo.name}/tree/${branch}`;
  }

  _getCommitUrl(repo, commit) {
    return `https://github.com/${repo.name}/commit/${commit.sha}`;
  }
}
window.customElements.define('gew-event', GewEvent);
