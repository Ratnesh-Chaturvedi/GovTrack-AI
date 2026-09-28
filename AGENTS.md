# GovTrack AI — Codex Instructions

You are working inside an existing **GovTrack AI** project.

The project already contains:

- `frontend/` → React.js with JSX
- `backend/` → Node.js + Express
- MongoDB
- `ml-service/` → Python FastAPI
- trained XGBoost models for:
  - cost escalation risk
  - schedule delay risk

Do not rebuild working parts unnecessarily.

Always inspect the existing structure before creating new files.

---

## 1. Main Development Philosophy

Write code that is:

- reusable
- modular
- easy to understand
- easy to maintain
- properly separated by responsibility
- consistent with existing project conventions

Avoid large components and repeated code.

Prefer:

```text
small reusable components
+
shared utilities
+
shared constants
+
custom hooks
+
service functions
```

instead of duplicating logic across pages.

---

# 2. Frontend Structure

Follow a clean React structure similar to:

```text
frontend/
└── src/
    ├── assets/
    │   ├── images/
    │   ├── icons/
    │   └── index.js
    │
    ├── components/
    │   ├── common/
    │   ├── layout/
    │   ├── dashboard/
    │   ├── projects/
    │   ├── analytics/
    │   ├── risk/
    │   └── charts/
    │
    ├── pages/
    │   ├── Dashboard/
    │   ├── Projects/
    │   ├── ProjectDetails/
    │   ├── Analytics/
    │   ├── HighRisk/
    │   └── ImportData/
    │
    ├── hooks/
    ├── services/
    ├── constants/
    ├── utils/
    ├── context/
    ├── layouts/
    ├── routes/
    ├── App.jsx
    └── main.jsx
```

Do not place everything directly inside `src/components`.

Group components according to their responsibility.

---

# 3. Reusable Components

Before creating a new component, check whether an existing component can be reused or extended.

Common reusable components should include things such as:

```text
Button
Card
Badge
Modal
Input
Select
SearchInput
Table
Pagination
Loader
Skeleton
EmptyState
ErrorState
PageHeader
SectionHeader
StatCard
RiskBadge
RiskScore
ChartCard
ProjectCard
```

Do not create multiple versions of the same component unless their behavior is genuinely different.

Example:

Instead of:

```text
HighRiskBadge.jsx
MediumRiskBadge.jsx
LowRiskBadge.jsx
```

create:

```text
RiskBadge.jsx
```

and use:

```jsx
<RiskBadge level="HIGH" />
<RiskBadge level="MEDIUM" />
<RiskBadge level="LOW" />
```

---

# 4. Component Props

Reusable components should receive their content and behavior using props.

Do not hard-code project-specific content inside reusable components.

Prefer:

```jsx
<StatCard
  title="High Risk Projects"
  value={highRiskCount}
  icon={AlertTriangle}
/>
```

instead of:

```jsx
<HighRiskProjectStatCard />
```

when the only difference is text, icon, or value.

---

# 5. Avoid Large Components

Do not create 500+ line JSX components when the page contains logically separate sections.

For example:

```text
ProjectDetails.jsx
```

should compose smaller components:

```text
ProjectHeader
ProjectRiskSummary
ProjectOverview
ProjectProgressChart
ProjectCostChart
ProjectTimeline
RiskExplanation
ProjectHistoryTable
```

The page should mainly coordinate these components.

Example:

```jsx
<ProjectHeader project={project} />

<ProjectRiskSummary prediction={prediction} />

<ProjectProgressChart observations={history} />

<ProjectCostChart observations={history} />

<RiskExplanation prediction={prediction} />

<ProjectHistoryTable observations={history} />
```

---

# 6. Images and Assets

Do not import image files individually throughout random components.

All static images should be managed through:

```text
frontend/src/assets/index.js
```

or:

```text
frontend/src/assets/images/index.js
```

Example:

```javascript
import logo from "./images/logo.png";
import dashboardIllustration from "./images/dashboard-illustration.png";
import emptyProjects from "./images/empty-projects.png";

export {
  logo,
  dashboardIllustration,
  emptyProjects,
};
```

Then components should use:

```javascript
import {
  logo,
  dashboardIllustration,
} from "@/assets";
```

Do not write:

```javascript
import logo from "../../../assets/images/logo.png";
```

throughout the project.

---

# 7. Barrel Files

When useful, create `index.js` files to simplify imports.

Example:

```text
components/common/index.js
```

```javascript
export { default as Button } from "./Button";
export { default as Badge } from "./Badge";
export { default as Card } from "./Card";
export { default as Loader } from "./Loader";
```

Then use:

```javascript
import {
  Button,
  Badge,
  Card,
} from "@/components/common";
```

Avoid excessive barrel files if they create circular dependencies.

---

# 8. Constants

Do not scatter repeated strings and configuration values across components.

Store them in:

```text
src/constants/
```

Example:

```javascript
export const RISK_LEVELS = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
};
```

Risk thresholds should also be centralized.

Example:

```javascript
export const RISK_THRESHOLDS = {
  LOW_MAX: 40,
  MEDIUM_MAX: 70,
};
```

---

# 9. API Services

Do not call Axios directly from every component.

Use a dedicated service layer:

```text
frontend/src/services/
```

Example:

```text
projectApi.js
analyticsApi.js
predictionApi.js
```

Example:

```javascript
export const getProjects = async (params) => {
  const response = await api.get("/projects", {
    params,
  });

  return response.data;
};
```

Components should not contain URL-building logic.

---

# 10. React Query

Use TanStack React Query for server state.

Create reusable hooks:

```text
src/hooks/
```

Examples:

```text
useProjects
useProject
useProjectHistory
useRiskSummary
useAnalytics
usePrediction
```

Pages should consume hooks instead of manually handling:

```text
loading
error
data
refetch
```

multiple times.

---

# 11. Local State

Use local component state only for UI state such as:

```text
modal open/close
selected tab
search input
temporary filters
dropdown state
```

Do not copy API data into local state unless necessary.

---

# 12. Styling

Use the project's existing styling system consistently.

If Tailwind is already used:

- use Tailwind
- reuse spacing patterns
- reuse typography
- reuse border radius
- reuse colors

Do not introduce a new styling library without a clear need.

Avoid random inline styles.

Prefer:

```jsx
className="..."
```

or reusable style helpers.

---

# 13. Design Consistency

GovTrack AI should look:

- professional
- modern
- clean
- government-appropriate
- data-focused
- trustworthy

Avoid:

- excessive gradients
- gaming-style UI
- neon colors
- excessive animation
- oversized decorative elements
- inconsistent card styles

Use animation only when it improves usability.

---

# 14. Risk Colors

Use consistent visual semantics.

Example:

```text
LOW
green

MEDIUM
amber/orange

HIGH
red
```

Do not use different risk colors on different pages.

Create one reusable mapping.

---

# 15. Charts

Create reusable chart wrappers rather than repeating Recharts configuration.

Examples:

```text
ProgressTrendChart
CostTrendChart
RiskDistributionChart
SectorRiskChart
StateRiskChart
```

Chart components should receive clean data via props.

Do data transformation in utilities/hooks when possible.

---

# 16. Tables

Use reusable table components for:

```text
projects
high-risk projects
history
analytics
```

Common behavior such as:

- loading
- empty state
- pagination
- sorting

should not be rewritten on every page.

---

# 17. Loading States

Every async page must handle:

```text
loading
error
empty
success
```

Prefer reusable:

```text
PageLoader
TableSkeleton
EmptyState
ErrorState
```

Never leave blank screens while data is loading.

---

# 18. Backend Structure

Keep the Node.js backend modular.

Recommended structure:

```text
backend/
└── src/
    ├── config/
    ├── controllers/
    ├── models/
    ├── routes/
    ├── services/
    ├── middleware/
    ├── validators/
    ├── utils/
    └── app.js
```

Responsibilities:

```text
routes
→ route definitions

controllers
→ HTTP request/response handling

services
→ business logic

models
→ MongoDB schemas

middleware
→ shared middleware

utils
→ generic helpers
```

Do not place major business logic directly in route files.

---

# 19. Controller Rules

Controllers should be thin.

Bad:

```text
controller
→ fetch DB
→ calculate everything
→ call ML
→ transform everything
→ paginate
→ aggregate
→ format response
```

Better:

```text
controller
→ call service
→ return response
```

Complex logic belongs inside services.

---

# 20. MongoDB

Use Mongoose models with:

- appropriate indexes
- validation
- timestamps
- consistent naming

Do not perform hundreds/thousands of individual writes when `bulkWrite()` can be used.

---

# 21. API Response Format

Use a consistent structure.

Success:

```json
{
  "success": true,
  "data": {}
}
```

Failure:

```json
{
  "success": false,
  "message": "Something went wrong"
}
```

Do not invent a different response format for every endpoint.

---

# 22. Error Handling

Use centralized Express error middleware.

Do not repeat large try/catch blocks unnecessarily.

Errors should be:

- logged
- meaningful
- safe to return to the client

Do not expose stack traces in production responses.

---

# 23. Python ML Service

Keep ML logic separate from Node.

Structure:

```text
ml-service/
├── main.py
├── models/
├── services/
├── schemas/
├── utils/
└── requirements.txt
```

`main.py` should mainly:

- initialize FastAPI
- load routes
- expose health endpoint
- load models

Feature engineering and prediction logic should live in services.

---

# 24. ML Models

The production models are:

```text
FINAL_cost_xgboost_pipeline.joblib

FINAL_schedule_xgboost_pipeline.joblib
```

Load each model once when FastAPI starts.

Do not reload them for every request.

---

# 25. ML Architecture

Always preserve:

```text
React
↓
Node.js
↓
FastAPI
↓
XGBoost
```

React must NOT call FastAPI directly.

Node is the main backend gateway.

---

# 26. Feature Engineering

Inference-time feature engineering must remain consistent with the training notebook.

Do not independently redesign:

```text
cost_overrun_pct
expenditure_ratio
remaining_cost
progress_change_1m
expenditure_change_1m
cost_change_1m
progress_velocity
spending_velocity
spend_progress_gap
progress_stagnation
months_observed
schedule_delay_months
```

Changing these formulas without retraining can invalidate predictions.

---

# 27. Shared Logic

Whenever the same logic appears more than once, consider moving it into:

```text
utility
hook
service
constant
component
```

Do not duplicate large blocks of logic.

But do not over-engineer a helper for a one-line operation used only once.

---

# 28. Naming

Use clear names.

Good:

```text
getProjectHistory
predictProjectRisk
getRiskSummary
calculateEffectiveCost
formatRiskScore
```

Avoid vague names:

```text
handleData
doStuff
temp
func1
data2
```

---

# 29. File Naming

React components:

```text
PascalCase.jsx
```

Examples:

```text
RiskBadge.jsx
ProjectCard.jsx
ProjectDetails.jsx
```

JS services/utilities:

```text
camelCase.js
```

Examples:

```text
projectApi.js
riskUtils.js
dateUtils.js
```

---

# 30. Function Size

Keep functions focused.

If a function:

- performs multiple unrelated jobs
- becomes difficult to understand
- contains deeply nested conditions

split it into smaller functions.

---

# 31. Comments

Write comments to explain:

- why something exists
- unusual business logic
- ML assumptions
- tricky transformations

Do not comment obvious lines.

Bad:

```javascript
// set loading to true
setLoading(true);
```

Good:

```javascript
// Refresh the prediction because a new monthly observation
// changes the features consumed by the XGBoost models.
```

---

# 32. Do Not Break Existing Code

Before changing an existing file:

1. inspect it
2. understand how it is used
3. search references
4. preserve existing behavior unless intentionally changing it

Prefer minimal, focused changes.

Do not refactor unrelated areas while implementing a feature.

---

# 33. Do Not Duplicate Existing Components

Before creating:

```text
Button
Modal
Table
Card
Loader
Badge
Input
Chart wrapper
```

search the project first.

Reuse existing components whenever appropriate.

---

# 34. Imports

Use clean import paths.

If project aliases are configured, prefer:

```javascript
import { RiskBadge } from "@/components/common";
```

instead of:

```javascript
import RiskBadge from "../../../../components/common/RiskBadge";
```

Do not change alias configuration unnecessarily if the existing project does not use it.

---

# 35. Images

All frontend static image imports must be exported through the asset index.

Example structure:

```text
assets/
├── images/
│   ├── logo.png
│   ├── empty-projects.png
│   └── dashboard-bg.png
└── index.js
```

`index.js`:

```javascript
import logo from "./images/logo.png";
import emptyProjects from "./images/empty-projects.png";
import dashboardBg from "./images/dashboard-bg.png";

export {
  logo,
  emptyProjects,
  dashboardBg,
};
```

Then:

```javascript
import {
  logo,
  dashboardBg,
} from "@/assets";
```

Do not scatter relative image paths throughout JSX.

---

# 36. Icons

Prefer Lucide React icons if the project already uses them.

Do not save simple common icons as image files unnecessarily.

---

# 37. Forms

Create reusable form inputs when multiple forms use the same patterns.

Handle:

- validation
- errors
- disabled states
- loading states

consistently.

---

# 38. Responsive UI

All pages must support:

- desktop
- tablet
- reasonable mobile layout

Dashboard tables may use horizontal scrolling on small screens.

Do not destroy usability by squeezing large tables into mobile width.

---

# 39. Accessibility

Use:

- semantic buttons
- labels for inputs
- descriptive alt text
- keyboard-accessible actions
- sufficient contrast

Do not use clickable `div`s where a button should be used.

---

# 40. Environment Variables

Never hard-code:

```text
MongoDB URLs
API hosts
FastAPI URLs
secrets
deployment domains
```

Use `.env`.

Frontend:

```text
VITE_API_URL
```

Backend:

```text
MONGODB_URI
ML_SERVICE_URL
CLIENT_URL
```

Python:

```text
COST_MODEL_PATH
SCHEDULE_MODEL_PATH
```

---

# 41. Code Quality Before Completion

Before marking a task complete:

- check imports
- remove unused variables
- remove dead code
- remove console debugging that is no longer needed
- check API paths
- check responsive layout
- check loading/error states
- verify reusable components
- verify no unnecessary duplication

---

# 42. Testing Changes

When implementing a feature, test the complete affected flow.

For prediction:

```text
React
↓
Node route
↓
MongoDB history
↓
FastAPI
↓
XGBoost
↓
Node response
↓
React UI
```

Do not declare the feature complete after testing only one layer.

---

# 43. GovTrack AI Domain Context

GovTrack AI monitors government projects using monthly PAIMANA-style project data.

Important project information includes:

```text
project ID
project name
sector
ministry
implementing agency
state
original cost
revised cost
anticipated cost
expenditure
physical progress
original completion date
revised completion date
```

The system predicts:

```text
Cost Risk
Schedule Risk
Overall Risk
Risk Category
```

Risk categories:

```text
LOW
MEDIUM
HIGH
```

---

# 44. Priority of Work

When asked to implement something:

1. inspect existing implementation
2. understand current architecture
3. identify reusable code
4. make smallest necessary changes
5. keep frontend/backend/ML responsibilities separate
6. test the affected flow
7. clean up code
8. summarize changed files

---

# 45. When Responding After Coding

After implementing a task, give a concise summary containing:

```text
What was changed
Files created
Files modified
How the flow works
How to run/test it
Any important limitation
```

Do not paste entire unchanged files unless requested.

---

# 46. Core Rule

Always optimize for:

```text
Readable
Reusable
Maintainable
Consistent
Modular
Minimal duplication
Easy to extend
```

Do not optimize for simply producing the largest amount of code.

The goal is a clean GovTrack AI codebase that another developer can understand and continue working on easily.