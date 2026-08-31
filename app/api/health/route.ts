import { mondayClient } from '@/lib/monday/client';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    // Test Monday.com API connection if token is provided
    if (process.env.MONDAY_API_TOKEN) {
      const testQuery = `query { me { id name } }`;
      await mondayClient.request(testQuery);
    }

    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        monday: process.env.MONDAY_API_TOKEN ? 'connected' : 'unconfigured',
        ai: process.env.NEXT_PUBLIC_GEMINI_API_KEY ? 'configured' : 'unconfigured',
      },
    });
  } catch (error) {
    logger.error(error as Error, 'Health check failed');
    return Response.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
