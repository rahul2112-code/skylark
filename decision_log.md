# Decision Log: Skylark BI Agent

## 1. Architecture & Framework Selection
**Decision:** Built using **Next.js 14 (App Router)** and **Vercel AI SDK v7**.
**Rationale:** 
- A full-stack framework was required to securely proxy requests to Monday.com and the LLM providers without exposing API keys to the client. Next.js App Router (using React Server Components and Route Handlers) provided the cleanest abstraction for this.
- Vercel AI SDK natively handles stream chunking and React state management (`useChat`), saving hours of boilerplate code for typing indicators and streaming text.

## 2. Monday.com Integration (Data Layer)
**Decision:** Used `graphql-request` directly against Monday.com's `v2` GraphQL API instead of relying on a heavy third-party SDK or MCP.
**Rationale:** 
- The Monday.com GraphQL API is robust, but the response structures are heavily nested and dynamic (e.g., column values are returned as JSON strings). 
- Writing custom GraphQL queries allowed for fetching *only* the required columns, minimizing the payload size sent to the LLM context window.

## 3. Data Resilience & Normalization
**Decision:** Implemented a robust `DataCleaner` utility class before passing data to the LLM.
**Rationale:** 
- Real-world CRM data is notoriously messy. The imported datasets contained null values, inconsistent number formats (e.g., some as strings, some as raw numbers), and deeply nested status labels.
- **Trade-off:** Processing this locally takes milliseconds but drastically reduces hallucination rates. Instead of dumping raw JSON into the LLM prompt, the agent receives a highly structured, normalized array of objects (e.g., handling missing close dates gracefully).

## 4. LLM Strategy & Tool Calling
**Decision:** Utilized **NVIDIA NIM (Llama 3.2 11B Vision Instruct)** as the primary reasoning engine, with an automatic fallback to **Google Gemini 3.6 Flash**.
**Rationale:** 
- Function calling (Tools) was critical to avoid hardcoding CSVs and to make the agent dynamic. The agent is provided with tools like `getDealsData` and `getWorkOrdersData`.
- Based on the user's prompt (e.g., "What is the total pipeline value?"), the LLM autonomously decides which tool to invoke, fetches the live data, and synthesizes the answer.

## 5. Bonus Feature: Leadership Updates
**Decision:** Configured the system prompt and UI to support **Executive Summaries**.
**Rationale:**
- To address the "leadership updates" optional feature, the agent is instructed (via System Prompt) to structure its responses for executives: using bold KPIs, avoiding filler text, and highlighting anomalies.
- If a user asks "Generate a leadership update," the agent pulls from both the Deals and Work Orders boards to create a cross-functional, summarized report ready for pasting into an email or presentation.

## 6. What I would do with more time
- **Caching Layer:** Implement Upstash Redis to cache board schemas and recent queries to avoid hitting Monday.com API rate limits during heavy usage.
- **Dynamic Board Discovery:** Currently, the board IDs are provided via `.env`. With more time, I would implement a tool that allows the agent to dynamically search the Monday.com workspace for relevant boards by name.
- **OAuth Flow:** Replace the Personal Access Token with a full OAuth 2.0 flow to support multi-tenant usage.
