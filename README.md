# GitHub Events Watcher

[![Build Status](https://travis-ci.org/mnixo/github-events-watcher.svg?branch=master)](https://travis-ci.org/mnixo/github-events-watcher)

GEW is a small web application that periodically requests the events related to a given GitHub organization, via the GitHub API.  

[Try it here!](https://mnixo.github.io/github-events-watcher/) 

### Parameters

- Organization: the ID of the GitHub organization (default: `nuxeo`)
- Request Interval: interval of time between two requests, in seconds (default: `30`)
- GitHub API Endpoint:
  - [Public Organization Events](https://developer.github.com/v3/activity/events/#list-public-events-for-an-organization) (default)
  - [Private Organization Events](https://developer.github.com/v3/activity/events/#list-events-for-an-organization) (requires authentication)

### Authentication

Authentication is not required but it is recommended, as it significantly increases the number of allowed requests to the GitHub API (read more about [GitHub API Rate Limiting](https://developer.github.com/v3/rate_limit/)) and allows fetching private organization events (if the authenticated user is an organization member).

Basic and token authentication are available.
