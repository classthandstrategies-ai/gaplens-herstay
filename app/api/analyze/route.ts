import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getHubById, getDefaultHub } from '@/lib/markets/data';
import { isSerpApiKeyConfigured, executeMarketSearch } from '@/lib/serpapi/client';
import { buildAnalysisReport } from '@/lib/analysis/gapEngine';
import { getSampleListingsForHub } from '@/lib/sample/sampleData';
import { isWithinRadius } from '@/lib/geo/distance';
import { AnalysisResponseEnvelope } from '@/lib/types';

const RequestSchema = z.object({
  hubId: z.string().min(1, 'Hub ID is required'),
  radiusKm: z.number().min(0.5).max(15.0).default(3.5),
  forceRefresh: z.boolean().optional().default(false),
});

export async function POST(req: NextRequest): Promise<NextResponse<AnalysisResponseEnvelope>> {
  const startTime = Date.now();

  try {
    const rawBody = await req.json().catch(() => ({}));
    const parseResult = RequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request parameters',
          details: parseResult.error.issues.map((i) => i.message).join(', '),
          code: 'INVALID_PARAMS',
        },
        { status: 400 }
      );
    }

    const { hubId, radiusKm } = parseResult.data;
    const hub = getHubById(hubId) || getDefaultHub();

    const hasApiKey = isSerpApiKeyConfigured();

    if (!hasApiKey) {
      // Return illustrative demo dataset with transparent labeling
      const allSample = getSampleListingsForHub(hub);
      const filtered = allSample.filter((l) =>
        isWithinRadius(hub.coordinates, l.coordinates, radiusKm)
      );

      const report = buildAnalysisReport(
        hub,
        radiusKm,
        filtered,
        'illustrative_sample',
        Date.now() - startTime,
        new Date().toISOString()
      );

      return NextResponse.json({
        success: true,
        data: report,
        details:
          'SERPAPI_API_KEY is not configured in the environment. Serving calibrated illustrative demonstration dataset. Configure SERPAPI_API_KEY in .env.local to run live public Maps & Reviews scans.',
        code: 'KEY_MISSING',
      });
    }

    // Run live SerpApi query
    const apiKey = process.env.SERPAPI_API_KEY!.trim();
    try {
      const { listings, isCached } = await executeMarketSearch(hub, radiusKm, apiKey);

      const dataSource = isCached ? 'cached_serpapi' : 'live_serpapi';
      const report = buildAnalysisReport(
        hub,
        radiusKm,
        listings,
        dataSource,
        Date.now() - startTime,
        new Date().toISOString()
      );

      return NextResponse.json({
        success: true,
        data: report,
        code: 'OK',
      });
    } catch (apiErr: unknown) {
      console.error('SerpApi live query failed:', apiErr);
      const message = apiErr instanceof Error ? apiErr.message : 'Unknown SerpApi error';

      // Fallback gracefully to illustrative baseline with clear warning
      const allSample = getSampleListingsForHub(hub);
      const filtered = allSample.filter((l) =>
        isWithinRadius(hub.coordinates, l.coordinates, radiusKm)
      );

      const report = buildAnalysisReport(
        hub,
        radiusKm,
        filtered,
        'illustrative_sample',
        Date.now() - startTime,
        new Date().toISOString()
      );

      return NextResponse.json(
        {
          success: true,
          data: report,
          error: `Live search query encountered an error: ${message}. Showing illustrative baseline data.`,
          code: 'NETWORK_ERROR',
        },
        { status: 200 }
      );
    }
  } catch (err: unknown) {
    console.error('API route exception:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error while analyzing accommodation market',
        details: err instanceof Error ? err.message : String(err),
        code: 'NETWORK_ERROR',
      },
      { status: 500 }
    );
  }
}
