/* eslint-disable @typescript-eslint/no-explicit-any */
import { convertToModelMessages, streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { tools } from '@/lib/ai/tools';

/** NVIDIA NIM is OpenAI-compatible — point it at NVIDIA's base URL */
const nvidia = createOpenAI({
  apiKey:  process.env.NVIDIA_API_KEY ?? '',
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

function hasGeminiKey() {
  return Boolean(
    process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY
  );
}

function useNvidia() {
  return Boolean(process.env.NVIDIA_API_KEY);
}

/** 
 * Uses NVIDIA if configured, otherwise falls back to Gemini.
 */
function getModel() {
  if (useNvidia()) {
    // NVIDIA Llama 3.2 11B Vision Instruct (supports tool calling on NIM)
    return nvidia('meta/llama-3.2-11b-vision-instruct');
  }
  return google('gemini-3.6-flash');
}

const SYSTEM_PROMPT = `You are a senior Business Intelligence analyst and AI assistant for Skylark Drones, a drone technology company. You have direct, live access to their Monday.com boards via specialized tools.

## Your Data Access
- **Deals Board**: Sales pipeline including deal stages, values, sector/industry, deal owners, expected close dates, and client names.
- **Work Orders Board**: Project execution data including work order status, assigned teams, deadlines, progress, and completion rates.

## How to Respond
1. **Always use numbers**: Cite specific figures (e.g., "₹2.4M pipeline across 18 deals").
2. **Structure your answers**: Use headers (##), bullet points, and tables for data-heavy responses.
3. **Highlight key insights**: Lead with the most important finding, then support with data.
4. **Flag data quality issues**: If data is missing, inconsistent, or null, mention it briefly.
5. **Be proactive**: Suggest follow-up questions the user might find useful.

## Data Quality Rules
- If a column value is null/empty, skip it or note it as "Not specified".
- If numeric values cannot be summed (e.g., all null), say "Pipeline value data is incomplete".
- If a board returns 0 items, mention that the board ID may need checking.

## Response Format
- For overviews: a summary sentence, then 2-3 key metrics in bold, then a breakdown table.
- For comparisons: side-by-side table.
- For lists (e.g., overdue items): numbered list with key details per item.
- Always end long responses with: "**Want me to dig deeper into any of these areas?**"

## Persona
You are direct, data-driven, and analytical. You speak like a CFO/COO advisor — not a generic chatbot.`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!Array.isArray(messages)) {
      return Response.json({ error: 'messages must be an array' }, { status: 400 });
    }

    if (!hasGeminiKey() && !useNvidia()) {
      return Response.json(
        { error: 'No AI API key configured. Set NVIDIA_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY in .env.local' },
        { status: 503 }
      );
    }

    const modelName = useNvidia() ? 'NVIDIA Llama 3.2 11B' : 'Gemini 3.6 Flash';
    console.log(`[chat] Using model: ${modelName}`);

    // Convert UI messages to model messages to strip extra fields (id, createdAt) 
    // that cause Zod validation errors in streamText.
    const modelMessages = await convertToModelMessages(messages, { tools });

    const result = (streamText as any)({
      model: getModel(),
      system: SYSTEM_PROMPT,
      messages: modelMessages,
      tools,
      toolChoice: 'auto',
      maxSteps: 5,
    });

    return (result as any).toUIMessageStreamResponse();
  } catch (error) {
    console.error('[chat] Error:', error);
    return Response.json(
      { error: 'Internal server error', detail: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}
