Yes. Since you’ve **already initialized Next.js + Tailwind CSS**, I would not overcomplicate the frontend architecture yet. The frontend should mirror the actual FinInsight workflow from your document: **upload → query → smart routing → answer → charts → sources/SQL inspection**. The project document specifically describes a left sidebar for PDF/CSV uploads, a main chat interface, dynamic charts, and a collapsible source drawer. 

## 1. Recommended Next.js frontend structure

Assuming you are using the **Next.js App Router**, use this:

```text
fininsight-frontend/
│
├── public/
│   ├── images/
│   ├── icons/
│   └── logos/
│
├── src/
│   │
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   │
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   │
│   │   └── dashboard/
│   │       ├── page.tsx
│   │       │
│   │       ├── chat/
│   │       │   └── page.tsx
│   │       │
│   │       ├── documents/
│   │       │   └── page.tsx
│   │       │
│   │       ├── datasets/
│   │       │   └── page.tsx
│   │       │
│   │       ├── history/
│   │       │   └── page.tsx
│   │       │
│   │       └── settings/
│   │           └── page.tsx
│   │
│   ├── components/
│   │   │
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Topbar.tsx
│   │   │   ├── DashboardShell.tsx
│   │   │   └── UserMenu.tsx
│   │   │
│   │   ├── chat/
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── SuggestedQueries.tsx
│   │   │   ├── ThinkingIndicator.tsx
│   │   │   └── QueryTypeBadge.tsx
│   │   │
│   │   ├── analytics/
│   │   │   ├── ChartCard.tsx
│   │   │   ├── RevenueChart.tsx
│   │   │   ├── ProfitChart.tsx
│   │   │   ├── ComparisonChart.tsx
│   │   │   ├── FinancialTable.tsx
│   │   │   └── MetricCard.tsx
│   │   │
│   │   ├── sources/
│   │   │   ├── SourceDrawer.tsx
│   │   │   ├── SourceCard.tsx
│   │   │   ├── CitationBadge.tsx
│   │   │   └── DocumentSnippet.tsx
│   │   │
│   │   ├── upload/
│   │   │   ├── FileUpload.tsx
│   │   │   ├── UploadDropzone.tsx
│   │   │   ├── UploadProgress.tsx
│   │   │   └── UploadedFileCard.tsx
│   │   │
│   │   ├── sql/
│   │   │   ├── SQLViewer.tsx
│   │   │   ├── SQLResultTable.tsx
│   │   │   └── QueryExplanation.tsx
│   │   │
│   │   └── ui/
│   │       └── ...shadcn components
│   │
│   ├── lib/
│   │   ├── api.ts
│   │   ├── utils.ts
│   │   ├── constants.ts
│   │   └── validators.ts
│   │
│   ├── hooks/
│   │   ├── useChat.ts
│   │   ├── useUpload.ts
│   │   ├── useDocuments.ts
│   │   └── useDatasets.ts
│   │
│   ├── services/
│   │   ├── chat.service.ts
│   │   ├── upload.service.ts
│   │   ├── document.service.ts
│   │   └── dataset.service.ts
│   │
│   ├── types/
│   │   ├── chat.ts
│   │   ├── analytics.ts
│   │   ├── documents.ts
│   │   ├── datasets.ts
│   │   └── api.ts
│   │
│   └── store/
│       ├── chatStore.ts
│       ├── documentStore.ts
│       └── uiStore.ts
│
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

### Important architectural decision

Don't put everything inside `app/`.

Use:

```text
app/
    routing + page composition

components/
    reusable UI

services/
    API communication

hooks/
    frontend logic

types/
    TypeScript contracts

store/
    global state

lib/
    utilities
```

This will save you a mess later when the FastAPI backend starts returning SQL results, chart data, citations, and hybrid responses.

---

# 2. Main application layout

I recommend this structure for the actual product:

```text
┌─────────────────────────────────────────────────────────────┐
│ FinInsight                         Search   Help   User      │
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│  Dashboard   │                                              │
│              │             FINANCIAL AI                     │
│  New Query   │                                              │
│              │       Ask anything about your data           │
│  Documents   │                                              │
│  Datasets    │       ┌──────────────────────────────┐       │
│              │       │ Ask about revenue, profit... │       │
│  History     │       └──────────────────────────────┘       │
│              │                                              │
│  ─────────   │       Suggested Questions                    │
│              │                                              │
│  Upload      │       • Compare Q1 vs Q2 revenue            │
│  PDF         │       • Why did profit decline?              │
│  CSV         │       • Show revenue trend                   │
│              │                                              │
│              │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

After asking a question, the screen becomes:

```text
┌──────────────┬──────────────────────────────────────────────┐
│              │ User                                         │
│ Sidebar      │ "Why did Q3 profit decline?"                 │
│              │                                              │
│              │ AI                                           │
│              │ ┌─────────────────────────────────────────┐  │
│              │ │ Q3 profit declined by 12.4%...          │  │
│              │ │                                         │  │
│              │ │ The primary factors were...             │  │
│              │ └─────────────────────────────────────────┘  │
│              │                                              │
│              │ ┌─────────────────────────────────────────┐  │
│              │ │ Revenue / Profit Chart                  │  │
│              │ │                                         │  │
│              │ │       ╭───╮                             │  │
│              │ │   ╭───╯   ╰───╮                         │  │
│              │ │ ──╯             ╰──                     │  │
│              │ └─────────────────────────────────────────┘  │
│              │                                              │
│              │ [View SQL] [View Sources] [Export]           │
│              │                                              │
│              │ ──────────────────────────────────────────── │
│              │ Ask a follow-up...                     Send  │
└──────────────┴──────────────────────────────────────────────┘
```

This directly reflects the project's intended behavior: numerical questions go through SQL, document questions through RAG, and mixed questions combine both and can produce charts. The workflow diagram on page 3 explicitly shows these three paths. 

---

# 3. Figma Make prompt

For Figma Make, **don't ask it to build the entire application in one vague sentence**. Give it the product behavior, screens, visual language, and component requirements.

Use this as your initial Figma Make prompt:

# FinInsight RAG — Figma Make UI Design Prompt

Design a production-quality SaaS web application called **FinInsight RAG**, an AI-powered financial analytics assistant.

The product combines structured financial database analytics with unstructured financial documents.

The system supports three types of user queries:

1. Numerical queries — retrieve exact financial values using SQL.
2. Document/insight queries — retrieve relevant information from uploaded PDFs using RAG/vector search.
3. Hybrid queries — combine SQL financial data and document context into one answer with charts and citations.

The frontend will ultimately be implemented using **Next.js, TypeScript, Tailwind CSS and reusable component architecture**. Design the UI so it can be translated cleanly into those technologies.

## Overall Design Direction

Create a premium, modern financial SaaS interface.

Visual characteristics:

* Clean
* Professional
* Data-focused
* Minimal
* Enterprise-grade
* AI-native
* High information density without feeling cluttered
* Strong visual hierarchy
* Excellent whitespace
* Subtle borders
* Soft rounded corners
* Restrained use of color
* Avoid flashy gradients
* Avoid excessive glassmorphism
* Avoid generic chatbot aesthetics

Use a neutral light theme as the primary design.

Use dark text, white/light surfaces, subtle gray borders and one strong accent color for primary actions and AI-related states.

Use a consistent 8px spacing system.

Use modern typography similar to Inter or Geist.

Design desktop-first at approximately 1440px width, while keeping the layout responsive for tablet and mobile.

---

# 1. Application Shell

Create a persistent application layout containing:

### Left Sidebar

Width approximately 240–260px.

Include:

* FinInsight logo
* Dashboard
* New Query
* Documents
* Datasets
* Query History
* Settings

Separate section:

DATA SOURCES

* Upload PDF
* Upload CSV

Bottom of sidebar:

* User avatar
* User name
* Account menu
* Settings

Sidebar should remain visually quiet and should not dominate the main analytics workspace.

---

# 2. Top Navigation

Create a top navigation bar inside the application.

Include:

* Current page title
* Global search
* Help icon
* Notifications
* User profile menu

Keep the top bar compact.

---

# 3. Dashboard Screen

Create the primary dashboard.

Header:

"Financial Intelligence"

Subtitle:

"Ask questions about your financial data and documents."

Show a large primary AI query input.

Placeholder:

"Ask about revenue, profit, expenses, risks, or financial performance..."

Below the query input create suggested questions:

* "Compare Q1, Q2 and Q3 revenue"
* "Why did Q3 profit decline?"
* "Show operating margin by quarter"
* "What risks were mentioned in the annual report?"

Create a small section showing recently analyzed queries.

Create a compact overview section containing:

* Documents indexed
* Datasets connected
* Queries analyzed
* Last analysis

---

# 4. AI Chat / Query Workspace

Create the main conversational analytics screen.

The layout should contain:

LEFT:

Conversation history / query navigation.

CENTER:

Main conversation.

RIGHT:

Optional contextual information panel.

User messages should appear as clean compact query cards.

AI responses should appear as structured analytical responses rather than simple chatbot bubbles.

Every AI response can contain:

* Answer summary
* Key metrics
* Charts
* Tables
* SQL query
* Sources
* Follow-up questions

Create clear visual separation between these sections.

---

# 5. Query Type Indicator

Every AI response should display how the system processed the question.

Possible states:

SQL ANALYSIS
RAG ANALYSIS
HYBRID ANALYSIS

Example:

HYBRID ANALYSIS
SQL + Document Retrieval

Use a small badge rather than a large banner.

The user should immediately understand whether the answer came from structured financial data, documents, or both.

---

# 6. Financial Metric Cards

Create reusable metric cards for:

* Revenue
* Operating Expenses
* Net Profit
* Profit Margin

Each card should support:

* Current value
* Previous period
* Percentage change
* Positive/negative indicator
* Small trend visualization

Example:

Revenue
$24.8M
+12.4%
vs previous quarter

Cards should feel like professional financial analytics components.

---

# 7. Charts

Create reusable chart cards.

Include examples for:

### Revenue Trend

Line chart showing:

Q1
Q2
Q3
Q4

### Profit Comparison

Bar chart comparing quarterly net profit.

### Operating Margin

Line chart showing margin percentage.

### Revenue vs Profit

Combined visualization.

Every chart card should contain:

* Chart title
* Time range
* Optional filter
* Legend
* Data visualization
* Export/action menu

Do not use charts simply for decoration. They should communicate financial information clearly.

---

# 8. Financial Data Table

Create a professional data table for SQL results.

Columns:

Company
Year
Quarter
Revenue
Operating Expense
Net Profit
Margin

Include:

* Sorting
* Filtering
* Pagination
* Column alignment
* Number formatting
* Export action

Use tabular numeric alignment appropriate for financial data.

---

# 9. SQL Viewer

Create a collapsible "View SQL" section below an analytical response.

When expanded, show:

Generated SQL

with a monospace code block.

Below it show:

Execution result

and the corresponding data table.

Add actions:

* Copy SQL
* Run again
* Export

The SQL viewer should feel like a developer/analytics inspection tool, not the primary interface.

---

# 10. Source / Citation Drawer

Create a right-side source drawer or expandable source section.

Title:

"Sources"

Each source card should show:

* Document name
* Page number
* Relevant text snippet
* Relevance indicator
* Open source action

Example:

Annual_Report_2025.pdf

Page 47

"Operating expenses increased primarily due to..."

Add a "View document" action.

Make citations visually trustworthy and easy to inspect.

---

# 11. Document Management Screen

Create a Documents page.

Header:

"Documents"

Primary action:

"Upload PDF"

Show uploaded documents in a table/card layout.

Each document should show:

* File name
* Type
* Pages
* Processing status
* Indexed date
* Vector status
* Actions

Statuses:

Processing
Indexed
Failed

Include drag-and-drop PDF upload.

Create upload states:

1. Empty state
2. Uploading
3. Processing
4. Successfully indexed
5. Failed

---

# 12. Dataset Management Screen

Create a Datasets page for CSV/structured financial data.

Primary action:

"Upload CSV"

Display:

* Dataset name
* Rows
* Columns
* Company
* Date imported
* Status

Create a dataset preview table.

Allow the user to inspect the structured financial data before querying it.

---

# 13. Query History

Create a Query History page.

Display previous questions.

Each row/card should contain:

* User question
* Query type
* Date/time
* Processing status
* Short answer preview

Query type examples:

SQL
RAG
HYBRID

Allow users to reopen a previous analysis.

---

# 14. Empty States

Design useful empty states.

Documents empty state:

"No financial documents yet"

"Upload annual reports, 10-K filings or earnings transcripts to start asking document-based questions."

Button:

"Upload PDF"

Dataset empty state:

"No financial datasets connected"

"Upload structured financial data to perform numerical analysis."

Button:

"Upload CSV"

Chat empty state:

"Ask your first financial question"

Show example queries.

---

# 15. Loading States

Create professional skeleton/loading states.

For AI processing show:

Analyzing question...

Classifying query...

Retrieving financial data...

Searching documents...

Combining insights...

Generating answer...

Do NOT create a fake overly-human AI animation.

Keep the loading experience professional and technical.

---

# 16. Error States

Create error UI for:

* PDF upload failure
* CSV upload failure
* Query failure
* SQL execution failure
* Document retrieval failure
* No relevant sources
* No financial data found

Example:

"Unable to complete the analysis"

Show a concise explanation and:

"Try again"

---

# 17. Design System

Create reusable design components and variants.

Components:

* Buttons
* Inputs
* Search input
* Dropdown
* Tabs
* Badges
* Cards
* Metric cards
* Tables
* Charts
* Modal
* Drawer
* Tooltip
* Toast
* File upload
* Avatar
* Skeleton
* Empty state

Create component variants for:

Primary
Secondary
Ghost
Destructive
Success
Warning

Maintain consistent spacing, radius, typography and interaction states.

---

# 18. Responsive Design

Desktop:

1440px primary design.

Tablet:

1024px.

Mobile:

390px.

On mobile:

* Collapse sidebar
* Use hamburger navigation
* Stack charts vertically
* Make tables horizontally scrollable
* Convert source drawer into bottom sheet
* Keep AI query input fixed near the bottom where appropriate

---

# 19. Important UX Principle

This is NOT a generic ChatGPT clone.

The product should feel like:

"Bloomberg-style financial analytics + AI assistant + document intelligence"

The primary visual focus should be:

Financial data
Charts
Evidence
Sources
SQL transparency

The AI conversation is the interaction layer, not the entire product.

Create a polished, realistic SaaS dashboard with production-level UX rather than a conceptual wireframe.

Generate all major screens and reusable components in a consistent design system.

## 4. Figma screens you should actually create

Don't let Figma Make generate 30 random screens. Start with these **8 core screens**:

| # | Screen                      | Priority    |
| - | --------------------------- | ----------- |
| 1 | Dashboard / New Query       | 🔴 Critical |
| 2 | AI Analysis / Chat          | 🔴 Critical |
| 3 | Analysis Result with Charts | 🔴 Critical |
| 4 | Documents                   | 🔴 Critical |
| 5 | Upload PDF/CSV              | 🔴 Critical |
| 6 | Dataset Explorer            | 🟠 High     |
| 7 | Query History               | 🟡 Medium   |
| 8 | Settings                    | 🟢 Later    |

### Most important screen

The **Analysis Result** screen is where your project will differentiate itself.

For example:

```text
┌─────────────────────────────────────────────────────────────┐
│ Q3 Profit Decline Analysis                                  │
│                                                             │
│ HYBRID ANALYSIS                                             │
│ SQL + RAG                                                   │
│                                                             │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│ │ Revenue  │ │ Expenses │ │ Net Profit│ │ Margin   │        │
│ │ $24.8M   │ │ $18.2M   │ │ $4.1M     │ │ 16.5%    │        │
│ │ +12.4%   │ │ +18.2%   │ │ -12.1%    │ │ -2.4%    │        │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Revenue & Profit Trend                                  │ │
│ │                                                         │ │
│ │                📈 Chart                                 │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ AI INSIGHT                                                  │
│ Q3 profit declined primarily because operating expenses...  │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Sources                                                 │ │
│ │ Annual_Report.pdf · Page 47                             │ │
│ │ Earnings_Transcript.pdf · Page 12                       │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ [ View SQL ]     [ View Sources ]     [ Export Analysis ]   │
└─────────────────────────────────────────────────────────────┘
```

That structure is strongly aligned with the backend response defined in your document: `/query` is expected to return the **final textual answer, generated SQL, raw data/chart points, and source document citations**. 

### One thing I'd change from the PDF

The document suggests **Streamlit or Next.js** for the frontend. Since you've already chosen Next.js, stick with it. Don't introduce Streamlit now. Your architecture should be:

```text
                    NEXT.JS FRONTEND
                          │
                          │ REST API
                          ▼
                    FASTAPI BACKEND
                          │
             ┌────────────┴────────────┐
             ▼                         ▼
       SQL / PostgreSQL          RAG / pgvector
             │                         │
             └────────────┬────────────┘
                          ▼
                    LLM / Router
                          │
                          ▼
                 Structured JSON
                          │
                          ▼
                 Next.js UI
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
       Answer           Charts          Sources
```

This is also consistent with the project's page-3 architecture where the Smart Router decides between **SQL_CHAIN, VECTOR_CHAIN, and HYBRID_CHAIN**, then sends the result to the final answer engine. 

**Next step:** build the **Dashboard + AI Query workspace in Figma first**. Once that is finalized, we can convert that exact Figma design into your Next.js component architecture rather than designing and coding two different UIs.
