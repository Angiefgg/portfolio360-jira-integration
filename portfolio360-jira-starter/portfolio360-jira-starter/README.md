# Portfolio360 — IT Portfolio Intelligence & Governance

A portfolio dashboard starter for technology project managers, PMOs and delivery leaders. It can run with sample data immediately or connect to **Jira Cloud** using each installer's own credentials.

> **Status:** MVP starter / demonstration project. Not a production-ready enterprise platform. Validate data mappings, permissions, security and KPI definitions before organizational use.

## What it demonstrates

- Executive portfolio KPIs: work items, active, completed, overdue and completion rate.
- Status distribution (pie chart) and work items by Jira project (bar chart).
- Search and status filtering.
- Jira Cloud integration through a server-side API proxy.
- Mock mode so reviewers can run the dashboard without a Jira account.
- Secrets kept on the server in `.env`, never in browser code.

## Architecture

```text
Jira Cloud REST API
       |
       v
Node.js / Express backend  <-- .env credentials (server only)
       |
       v
Data normalization + summary calculations
       |
       v
HTML/CSS/JavaScript dashboard
```

## Requirements

- Node.js 18 or newer (uses built-in `fetch`).
- npm.
- Optional: Jira Cloud account with permission to browse the selected projects.

## 1. Run with sample data

For a detailed step-by-step guide in Spanish (Windows, macOS and Linux), see [`docs/QUICKSTART-DEMO-ES.md`](docs/QUICKSTART-DEMO-ES.md).


```bash
npm install
cp .env.example .env
```

Keep `JIRA_MODE=mock` in `.env`, then:

```bash
npm start
```

Open http://localhost:3000.

## 2. Connect your own Jira Cloud

### Step A — Create an API token

1. Sign in to your Atlassian account.
2. Open Atlassian account settings → Security → API tokens.
3. Create a token. Use an expiration date and a descriptive label.
4. Copy it once and store it in a password manager.
5. Never paste the token into a GitHub issue, README, screenshot, frontend file or public repository.

Atlassian may update its account settings UI. Follow the current Atlassian documentation if the menu labels differ.

### Step B — Configure `.env`

Copy `.env.example` to `.env` and update:

```env
JIRA_MODE=jira
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your.name@company.com
JIRA_API_TOKEN=your-own-token
JIRA_PROJECT_KEYS=DEMO,OPS
JIRA_JQL=
JIRA_MAX_RESULTS=100
```

- `JIRA_BASE_URL`: your Jira Cloud site URL, without a trailing slash.
- `JIRA_EMAIL`: Atlassian account email associated with the API token.
- `JIRA_API_TOKEN`: your personal API token.
- `JIRA_PROJECT_KEYS`: comma-separated project keys.
- `JIRA_JQL`: optional custom JQL. If provided, it takes precedence over project keys.
- `JIRA_MAX_RESULTS`: maximum number of records requested (capped at 100 in this starter).

Example custom JQL for Epics:

```jql
project in (DEMO, OPS) AND issuetype = Epic ORDER BY updated DESC
```

Example for all non-completed work items:

```jql
project in (DEMO, OPS) AND statusCategory != Done ORDER BY updated DESC
```

Choose a JQL query that matches how your organization represents initiatives. Some Jira sites use Epics; others use Plans, custom issue types or a separate portfolio tool. The starter currently treats each returned Jira issue as a work item, not as a fully modeled business initiative.

### Step C — Start the application

```bash
npm start
```

Open http://localhost:3000. The source label should show `JIRA`.

## 3. Publish safely on GitHub

1. Commit the source code and `.env.example`.
2. Confirm `.env` is ignored by `.gitignore`.
3. Never commit `.env`, API tokens, exports containing confidential company data or customer information.
4. Do not put Jira credentials in `public/index.html`.
5. If a token is accidentally exposed, revoke it immediately in Atlassian and create a new one.

**Important:** GitHub Pages only serves static files. It cannot safely run this backend or store Jira secrets. For a live Jira-connected deployment, host the Node.js backend on an approved server/platform and configure environment variables there. Deploy only the static frontend if it is adapted to call that secured backend.

## Current scope and limitations

- Jira Cloud only. Jira Data Center / Server authentication and endpoints may differ.
- Uses Jira Cloud REST API v3 search endpoint and a JQL query.
- Fetches up to 100 matching issues per request; pagination and scheduled sync are not implemented.
- KPI definitions are intentionally simple: completion is based on Jira status category `Done`; overdue means due date is before today's date and status category is not `Done`.
- A blocked count is exposed by the backend, but a site's workflow may use a different status name. Customize the mapping.
- Budget, resource capacity, benefits, baselines, SPI and CPI are not inferred from Jira unless the required fields and validated calculations are added.
- No authentication layer for dashboard users, audit log, multi-tenant isolation, persistent warehouse or production monitoring is included.

## Suggested next steps

1. Confirm the organization's initiative hierarchy and status mapping.
2. Add pagination and rate-limit handling.
3. Add authentication, authorization and audit logging.
4. Add a persistent data store and scheduled synchronization.
5. Integrate approved financial and resource data sources.
6. Define PMO-approved RAG rules and KPI formulas.
7. Add tests, deployment pipeline, monitoring and operational runbooks.

## Security

See [`docs/SECURITY.md`](docs/SECURITY.md) before connecting a real Jira site.

## License

MIT — see [`LICENSE`](LICENSE).
