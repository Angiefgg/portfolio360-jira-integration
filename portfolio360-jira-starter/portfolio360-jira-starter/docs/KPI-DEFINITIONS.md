# KPI definitions in this starter

These definitions are intentionally basic and should be approved or replaced by the organization's PMO before operational use.

| KPI | Current calculation | Caveat |
|---|---|---|
| Work items | Number of Jira issues returned by JQL | Depends on query and max result cap |
| Active | Items whose status category is not `Done` | Workflow mapping may vary |
| Completed | Items whose status category is `Done` | Completion is not necessarily business acceptance |
| Overdue | Due date before today and status category not `Done` | Requires consistent due dates |
| Completion rate | Completed / returned items × 100 | Not a weighted project progress measure |
| Status distribution | Count by Jira status name | Status names vary across workflows |
| Project distribution | Count of returned items grouped by Jira project | Not a count of portfolio initiatives |

## Not included yet

- SPI / CPI and Earned Value Management
- Planned-vs-actual budget variance
- Weighted progress by milestones or story points
- Resource utilization / capacity
- Forecast-at-completion
- Portfolio-level RAG roll-up rules

Do not label the simple completion rate as project progress or delivery confidence.
