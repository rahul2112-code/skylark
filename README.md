<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Monday_logo.svg/2560px-Monday_logo.svg.png" alt="Monday.com Logo" width="200" />
  <h1 align="center">Skylark BI Agent</h1>
  <p align="center">
    <strong>An autonomous, AI-powered Business Intelligence Agent for Monday.com</strong>
  </p>
  
  <p align="center">
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" /></a>
    <a href="https://sdk.vercel.ai/"><img src="https://img.shields.io/badge/AI_SDK-v7-white?style=for-the-badge&logo=vercel" alt="Vercel AI SDK" /></a>
    <a href="https://build.nvidia.com/"><img src="https://img.shields.io/badge/NVIDIA-NIM-76B900?style=for-the-badge&logo=nvidia" alt="NVIDIA" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" /></a>
  </p>
</div>

<br />

## 🚀 Overview

The **Skylark BI Agent** is a production-grade intelligent interface that connects directly to your Monday.com workspace. Built with modern web technologies, it allows executives and project managers to interact with live CRM and project execution data using natural language. 

Ask questions like *"What is our total pipeline value?"* or *"Show me all overdue work orders"* and the agent will securely fetch, analyze, and present the data from Monday.com in real-time.

## ✨ Core Features

- **🧠 Advanced AI Reasoning**: Powered by **NVIDIA NIM (Llama 3.2 11B Vision Instruct)** for highly analytical, data-driven responses, with an automatic fallback to **Google Gemini 3.6 Flash**.
- **🔄 Real-time Data Sync**: Connects directly to Monday.com's v2 GraphQL API to pull live Deals and Work Order data.
- **🎨 Premium UI/UX**: A sleek, dark-mode-first interface utilizing glassmorphism, fluid animations, and a responsive chat layout built with Tailwind CSS.
- **🛠️ Autonomous Tool Calling**: The agent inherently knows when to trigger API tools to fetch specific board data based on user intent.
- **🛡️ Production Hardened**: Implements robust error handling, strict TypeScript typings, and data sanitization pipelines for enterprise use.

---

## 🏗️ Architecture

The application is built on a unified Next.js App Router architecture:

- **Frontend**: React Server Components (RSC) with a stateful chat interface (`ai/react`).
- **Backend Edge**: Next.js API Routes acting as the LLM orchestrator.
- **Data Layer**: Custom GraphQL clients configured for Monday.com with specialized schema parsers to clean complex board data (handling status columns, nested values, and timelines).

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18.17 or later
- A Monday.com Personal Access Token (`v2` API)
- An AI Provider Key (NVIDIA NIM or Google Gemini)

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/rahul2112-code/skylark.git
cd skylark
npm install
```

### 2. Environment Configuration

Copy the example environment variables file:

```bash
cp .env.example .env.local
```

Populate `.env.local` with your secure credentials:

```env
# AI Provider Keys (NVIDIA is primary, Gemini is fallback)
NVIDIA_API_KEY=your_nvidia_key_here
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key_here
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key_here

# Monday.com Configuration
MONDAY_API_TOKEN=your_monday_personal_access_token
MONDAY_DEALS_BOARD_ID=your_deals_board_id
MONDAY_WORK_ORDERS_BOARD_ID=your_work_orders_board_id
```

### 3. Running Locally

Start the Next.js development server with Turbopack for lightning-fast compilation:

```bash
npm run dev
```

The agent will be available at **[http://localhost:3000](http://localhost:3000)**.

---

## 🔒 Security Best Practices

- **Never commit `.env.local`**: This file is correctly ignored in `.gitignore`.
- **API Key Scopes**: Ensure your Monday.com token is restricted to `read:boards` and `read:workspaces` if write access is not required.
- **Client/Server Boundary**: All API requests to Monday.com and the LLM providers happen exclusively server-side. No API keys are ever exposed to the client bundle.

---

## 🚢 Deployment

The easiest way to deploy this application is via [Vercel](https://vercel.com/new).

1. Push your code to your GitHub repository.
2. Import the project into Vercel.
3. In the Vercel dashboard, go to **Settings > Environment Variables** and paste the contents of your `.env.local` file.
4. Click **Deploy**.

---
<div align="center">
  <i>Engineered for Skylark Drones to transform data into decisions.</i>
</div>
