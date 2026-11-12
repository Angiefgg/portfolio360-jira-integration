import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = Number(process.env.PORT || 3000);
app.use(express.static("public"));

const mockItems = [
  { key:"DEMO-101", project:"Digital Onboarding", projectKey:"DEMO", summary:"Onboarding MVP", status:"In Progress", statusCategory:"In Progress", priority:"High", assignee:"Alex Morgan", dueDate:"2026-12-12", issueType:"Epic", updated:"2026-11-10" },
  { key:"DEMO-102", project:"Digital Onboarding", projectKey:"DEMO", summary:"Identity verification integration", status:"To Do", statusCategory:"To Do", priority:"Medium", assignee:"Taylor Reed", dueDate:"2026-12-20", issueType:"Story", updated:"2026-11-08" },
  { key:"OPS-201", project:"Service Operations", projectKey:"OPS", summary:"Service desk automation", status:"Done", statusCategory:"Done", priority:"Medium", assignee:"Jordan Lee", dueDate:"2026-11-05", issueType:"Epic", updated:"2026-11-09" },
  { key:"PLAT-301", project:"Platform Modernization", projectKey:"PLAT", summary:"Platform upgrade", status:"In Progress", statusCategory:"In Progress", priority:"High", assignee:"Casey Smith", dueDate:"2026-11-18", issueType:"Epic", updated:"2026-11-11" },
  { key:"DATA-401", project:"Data Enablement", projectKey:"DATA", summary:"Data quality controls", status:"Blocked", statusCategory:"In Progress", priority:"Highest", assignee:"Riley Chen", dueDate:"2026-11-09", issueType:"Epic", updated:"2026-11-07" },
  { key:"AUTO-501", project:"Workflow Automation", projectKey:"AUTO", summary:"Approval workflow", status:"In Progress", statusCategory:"In Progress", priority:"Low", assignee:"Sam Patel", dueDate:"2027-01-15", issueType:"Epic", updated:"2026-11-11" }
];

function toDate(value) {
  if (!value) return null;
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function summarize(items) {
  const today = new Date();
  today.setHours(0,0,0,0);
  const done = items.filter(x => x.statusCategory === "Done").length;
  const overdue = items.filter(x => {
    const due = toDate(x.dueDate);
    return due && due < today && x.statusCategory !== "Done";
  }).length;
  const blocked = items.filter(x => /block/i.test(x.status)).length;
  const active = items.filter(x => x.statusCategory !== "Done").length;
  const statusCounts = {};
  for (const item of items) statusCounts[item.status] = (statusCounts[item.status] || 0) + 1;
  const projectCounts = {};
  for (const item of items) {
    const key = item.project || item.projectKey || "Unassigned";
    projectCounts[key] = (projectCounts[key] || 0) + 1;
  }
  return {
    totalItems: items.length, activeItems: active, completedItems: done,
    overdueItems: overdue, blockedItems: blocked,
    completionRate: items.length ? Math.round(done / items.length * 100) : 0,
    statusCounts, projectCounts
  };
}

async function getJiraItems() {
  const baseUrl = (process.env.JIRA_BASE_URL || "").replace(/\/+$/, "");
  const email = process.env.JIRA_EMAIL;
  const token = process.env.JIRA_API_TOKEN;
  if (!baseUrl || !email || !token) {
    throw new Error("Jira connection is incomplete. Check JIRA_BASE_URL, JIRA_EMAIL and JIRA_API_TOKEN in your local .env file.");
  }
  let jql = process.env.JIRA_JQL?.trim();
  if (!jql) {
    const keys = (process.env.JIRA_PROJECT_KEYS || "").split(",").map(x => x.trim()).filter(Boolean);
    if (!keys.length) throw new Error("Set JIRA_PROJECT_KEYS or provide JIRA_JQL in .env.");
    jql = `project in (${keys.join(",")}) ORDER BY updated DESC`;
  }
  const maxResults = Math.min(Math.max(Number(process.env.JIRA_MAX_RESULTS || 100), 1), 100);
  const auth = Buffer.from(`${email}:${token}`).toString("base64");
  const response = await fetch(`${baseUrl}/rest/api/3/search/jql`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      jql,
      maxResults,
      fields: ["summary","status","assignee","duedate","priority","project","issuetype","updated"]
    })
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Jira API returned ${response.status}. Check the Jira URL, account permissions, token and JQL. Details: ${body.slice(0,400)}`);
  }
  const payload = await response.json();
  return (payload.issues || []).map(issue => ({
    key: issue.key,
    project: issue.fields.project?.name || "Unassigned",
    projectKey: issue.fields.project?.key || "",
    summary: issue.fields.summary || "(No summary)",
    status: issue.fields.status?.name || "Unknown",
    statusCategory: issue.fields.status?.statusCategory?.name || "Unknown",
    priority: issue.fields.priority?.name || "Unspecified",
    assignee: issue.fields.assignee?.displayName || "Unassigned",
    dueDate: issue.fields.duedate || "",
    issueType: issue.fields.issuetype?.name || "Unknown",
    updated: issue.fields.updated || ""
  }));
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, mode: process.env.JIRA_MODE === "jira" ? "jira" : "mock" });
});

app.get("/api/portfolio", async (_req, res) => {
  try {
    const mode = (process.env.JIRA_MODE || "mock").toLowerCase();
    const items = mode === "jira" ? await getJiraItems() : mockItems;
    res.json({
      source: mode,
      refreshedAt: new Date().toISOString(),
      summary: summarize(items),
      items
    });
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Portfolio360 is running at http://localhost:${port}`);
});
