import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getHubById } from '@/lib/markets/data';
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

    const { hubId, radiusKm, forceRefresh } = parseResult.data;

    // Reject unknown hubs explicitly: DO NOT silently fall back to default market
    const hub = getHubById(hubId);
    if (!hub) {
      return NextResponse.json(
        {
          success: false,
          error: `Unrecognized employment hub ID: '${hubId}'.`,
          details:
            "Supported hub IDs are 'manyata-tech-park-blr', 'hinjewadi-it-park-pune', or 'gachibowli-financial-district-hyd'.",
          code: 'INVALID_PARAMS',
        },
        { status: 400 }
      );
    }

    const hasApiKey = isSerpApiKeyConfigured();

    if (!hasApiKey) {
      // In illustrative demo mode (explicit key missing), serve calibrated sample baseline with transparent disclosure
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
          'SERPAPI_API_KEY is not configured in the environment. Serving calibrated illustrative demonstration dataset. Configure SERPAPI_API_KEY in .env.local or Vercel environment to execute live Google Maps & Reviews scans.',
        code: 'KEY_MISSING',
      });
    }

    // Run live SerpApi query
    const apiKey = process.env.SERPAPI_API_KEY!.replace(/["']/g, '').trim();
    try {
      const { listings, isCached } = await executeMarketSearch(
        hub,
        radiusKm,
        apiKey,
        forceRefresh
      );

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
      const message = apiErr instanceof Error ? apiErr.message : String(apiErr);
      console.error('SerpApi live query failed:', message);

      // Return explicit error state: NEVER silently fabricate or replace failed live searches with sample data
      return NextResponse.json(
        {
          success: false,
          error: `Live SerpApi search query failed: ${message}`,
          details:
            'The live search pipeline encountered an error. Live requests are not silently substituted with fabricated data.',
          code: 'NETWORK_ERROR',
        },
        { status: 502 }
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
