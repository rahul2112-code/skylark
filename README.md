<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Monday_logo.svg/2560px-Monday_logo.svg.png" alt="Monday.com Logo" width="180" />
  <h1 align="center">Skylark Drones: Full-Stack Developer Assignment</h1>
  <p align="center">
    <strong>An autonomous AI Business Intelligence Agent connecting LLMs to Monday.com</strong>
  </p>
  
  <p align="center">
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" /></a>
    <a href="https://sdk.vercel.ai/"><img src="https://img.shields.io/badge/AI_SDK-v7-white?style=for-the-badge&logo=vercel" alt="Vercel AI SDK" /></a>
    <a href="https://build.nvidia.com/"><img src="https://img.shields.io/badge/NVIDIA-NIM-76B900?style=for-the-badge&logo=nvidia" alt="NVIDIA" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" /></a>
  </p>
</div>

<br />

## 🎯 Assignment Objective

This repository contains the submission for the **Full-Stack Developer** role at Skylark Drones. 

The objective was to build a specialized Business Intelligence (BI) Chatbot that can seamlessly integrate with the Monday.com API, fetch live workspace data (Deals and Work Orders), and process it intelligently using an LLM.

### 🌟 Key Achievements in this Submission:
- **Autonomous Tool Calling**: The agent dynamically parses natural language questions, decides which Monday.com board to query, and fetches only the relevant data.
- **Enterprise-Grade AI**: Implements **NVIDIA NIM** (Llama 3.2 11B Vision Instruct) as the primary reasoning engine, with a seamless fallback to Google Gemini.
- **Robust Data Pipeline**: Uses Monday.com's `v2` GraphQL API with custom TypeScript parsers to clean messy CRM data (handling nulls, missing columns, and nested JSON values).
- **Premium User Experience**: Built a responsive, dark-mode-first chat interface featuring glassmorphism and fluid streaming responses (Vercel AI SDK).

---

## 🏗️ Architecture & Technical Decisions

1. **Framework (Next.js App Router)**: Chosen for its unified frontend/backend capabilities. React Server Components and API routes keep the API keys completely hidden from the client browser.
2. **AI Orchestration (Vercel AI SDK v7)**: Provides a standardized `streamText` interface capable of streaming both UI elements and text tokens natively to React.
3. **API Integration (GraphQL)**: Uses `graphql-request` for typed, lightweight queries against Monday.com's endpoints, avoiding bloated SDK wrappers.
4. **Resilience**: The backend route gracefully handles API rate limits, invalid tokens, and missing data points without crashing the client UI.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18.17 or later
- A Monday.com Personal Access Token (`v2` API)
- An AI Provider Key (NVIDIA NIM or Google Gemini)

### 1. Monday.com Setup Instructions
To run this project, you must connect it to a Monday.com workspace with the imported assignment data.
1. Create a free Monday.com account and navigate to your workspace.
2. Create two new boards: **Deals** and **Work Orders**.
3. Import the provided `Deal funnel Data.xlsx` and `Work_Order_Tracker Data.xlsx` into their respective boards.
4. Go to **Profile Picture > Developers > Developer Center > My Access Tokens** and generate a Personal Access Token (PAT).
5. Copy the **Board IDs** from the URL of each board (e.g., `monday.com/boards/123456789` -> ID is `123456789`).

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/rahul2112-code/skylark.git
cd skylark
npm install
```

### 3. Environment Variables

Create a `.env.local` file at the root of the project:

```bash
cp .env.example .env.local
```

Fill in your evaluation credentials:

```env
# AI Provider Keys
NVIDIA_API_KEY=your_nvidia_key_here
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key_here
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key_here

# Monday.com Configuration
MONDAY_API_TOKEN=your_monday_personal_access_token
MONDAY_DEALS_BOARD_ID=your_deals_board_id
MONDAY_WORK_ORDERS_BOARD_ID=your_work_orders_board_id
```

### 3. Start the Server

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser to evaluate the agent.

---
*Developed by Rahul Reddy for the Skylark Drones Engineering Team.*
