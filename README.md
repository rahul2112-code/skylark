# Monday.com Business Intelligence Agent

A production-ready Business Intelligence agent powered by Next.js, Vercel AI SDK, and NVIDIA NIM (Llama 3.2 11B Vision Instruct) / Google Gemini. 

This agent connects directly to your Monday.com workspace to analyze data from Deals and Work Orders boards in real-time. It features a premium, modern dark-mode UI with glassmorphism effects and provides instant, data-backed insights.

## Features

- **Live Monday.com Integration:** Real-time fetching of Deals and Work Orders data.
- **AI-Powered Analysis:** Ask natural language questions about your pipeline, overdue tasks, and sector performance.
- **Dual AI Provider Support:** Uses NVIDIA NIM (Llama models) natively, with an automatic fallback to Google Gemini.
- **Premium UI:** Built with Tailwind CSS, lucide-react, and sleek animations.
- **Production Hardened:** Robust error handling, strict TypeScript typings, and optimized caching logic.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **AI Framework:** Vercel AI SDK v7
- **AI Models:** NVIDIA NIM (`meta/llama-3.2-11b-vision-instruct`), Google Gemini (`gemini-3.6-flash`)
- **Styling:** Tailwind CSS + Radix Colors
- **API Integration:** GraphQL Request (Monday.com API v2)

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd monday-bi-agent
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file and fill in your keys:
   ```bash
   cp .env.example .env.local
   ```
   
   *Required Keys in `.env.local`:*
   - `NVIDIA_API_KEY`: Get from [build.nvidia.com](https://build.nvidia.com) (or `NEXT_PUBLIC_GEMINI_API_KEY` for Google)
   - `MONDAY_API_TOKEN`: Your Monday.com Personal Access Token
   - `MONDAY_DEALS_BOARD_ID`: ID for your sales pipeline board
   - `MONDAY_WORK_ORDERS_BOARD_ID`: ID for your work orders board

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to use the application.

## GitHub Deployment

To deploy this project:
1. Push this repository to your GitHub account.
2. Connect the repository to [Vercel](https://vercel.com).
3. Ensure you add all your `.env.local` variables into Vercel's Environment Variables settings before deploying.

---
*Built for Skylark Drones.*
