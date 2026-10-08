import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getHubById } from '@/lib/markets/data';
import { isSerpApiKeyConfigured, executeMarketSearch } from '@/lib/serpapi/client';
import { buildAnalysisReport } from '@/lib/analysis/gapEngine';
import { getSampleListingsForHub } from '@/lib/sample/sampleData';
import { isWithinRadius } from '@/lib/geo/distance';
import { AnalysisResponseEnvelope } from '@/lib/types';

import { checkRateLimit } from '@/lib/rateLimit';

const RequestSchema = z.object({
  hubId: z.string().min(1, 'Hub ID is required'),
  radiusKm: z.number().min(0.5).max(15.0).default(3.5),
  forceRefresh: z.boolean().optional().default(false),
});

export async function POST(req: NextRequest): Promise<NextResponse<AnalysisResponseEnvelope>> {
  const startTime = Date.now();

  try {
    // 1. IP Rate Limiting to prevent automated credit exhaustion
    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    if (checkRateLimit(clientIp)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please wait before requesting additional market analyses.',
          details: 'Maximum 15 analysis scans allowed per minute per IP address.',
          code: 'RATE_LIMITED',
        },
        {
          status: 429,
          headers: {
            'Retry-After': '60',
          },
        }
      );
    }

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

    // 2. Restrict forceRefresh access: Unrestricted public cache bypass is forbidden
    if (forceRefresh) {
      const adminHeader = req.headers.get('x-admin-key');
      const authHeader = req.headers.get('authorization');
      const adminSecret = process.env.ADMIN_REFRESH_SECRET;
      const configuredApiKey = process.env.SERPAPI_API_KEY?.replace(/["']/g, '').trim();

      const isAuthorized =
        (adminSecret && adminHeader === adminSecret) ||
        (configuredApiKey &&
          (authHeader === `Bearer ${configuredApiKey}` || adminHeader === configuredApiKey));

      if (!isAuthorized) {
        return NextResponse.json(
          {
            success: false,
            error: 'Unrestricted forceRefresh is disabled to prevent SerpApi credit exhaustion.',
            details:
              'Standard cached and live market intelligence is served automatically. Administrative authorization is required to force cache bypass.',
            code: 'FORBIDDEN',
          },
          { status: 403 }
        );
      }
    }

    // 3. Reject unknown hubs explicitly: DO NOT silently fall back to default market
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
        new Date().toISOString(),
        'complete'
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
      const { listings, isCached, searchCoverage, partialCoverageNote } =
        await executeMarketSearch(hub, radiusKm, apiKey, forceRefresh);

      const dataSource = isCached ? 'cached_serpapi' : 'live_serpapi';
      const report = buildAnalysisReport(
        hub,
        radiusKm,
        listings,
        dataSource,
        Date.now() - startTime,
        new Date().toISOString(),
        searchCoverage,
        partialCoverageNote
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
