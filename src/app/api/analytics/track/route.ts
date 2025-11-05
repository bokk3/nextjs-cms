import { NextRequest, NextResponse } from 'next/server'
import { trackEvent } from '@/lib/analytics-service'

/**
 * POST /api/analytics/track - Track an analytics event
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      sessionId,
      pagePath,
      pageTitle,
      referrer,
      userAgent,
      language,
      country,
      eventType,
      metadata,
    } = body

    console.log('[Analytics API] Received track request', { sessionId, pagePath, eventType })

    if (!sessionId || !pagePath) {
      console.log('[Analytics API] Missing required fields', { sessionId: !!sessionId, pagePath: !!pagePath })
      return NextResponse.json(
        { error: 'Session ID and page path are required' },
        { status: 400 }
      )
    }

    // Track the event (service will check consent)
    await trackEvent({
      sessionId,
      pagePath,
      pageTitle,
      referrer,
      userAgent,
      language,
      country,
      eventType: eventType || 'pageview',
      metadata,
    })

    console.log('[Analytics API] Track request completed')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Analytics API] Error tracking analytics event:', error)
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    )
  }
}

