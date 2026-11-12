# Security and operational guidance

This starter is intended for local evaluation and controlled demos.

## Credential handling

- Keep Jira credentials in a local `.env` file or deployment secret manager.
- `.env` is excluded from Git by `.gitignore`.
- Do not expose tokens in browser JavaScript, query strings, logs, screenshots or issue comments.
- Use a dedicated Atlassian account where organizational policy permits.
- Grant only the Jira project permissions required to read the selected projects.
- Set token expiry and rotate/revoke tokens according to company policy.
- If a token is committed or shared, revoke it immediately; deleting the commit is not enough.

## Deployment

The Express server holds the Jira token and makes API calls server-side. Do not deploy this app as static-only GitHub Pages while expecting the Jira integration to work. Use an approved backend host and configure secrets as environment variables. Protect the app with corporate SSO or another approved authentication mechanism before exposing it beyond a local demo.

## Data governance

Before using real company data, confirm authorization with the Jira administrator and data owner. Project summaries, assignees, due dates and priorities can be confidential. Do not use production data in a public demo. Consider field minimization, retention, access logging and regional hosting requirements.

## API permissions and behavior

The Jira account/token can only access projects and fields that the account is allowed to browse. A successful API response does not imply that all projects or fields are included. Validate JQL, status categories, due-date conventions and custom fields with the Jira administrator.
