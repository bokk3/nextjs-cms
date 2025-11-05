import { prisma } from './db'

export interface AnalyticsEventData {
  sessionId: string
  pagePath: string
  pageTitle?: string
  referrer?: string | null
  userAgent?: string | null
  language?: string
  country?: string
  eventType?: string
  metadata?: Record<string, any>
}

/**
 * Track an analytics event
 * Only tracks if analytics cookies are consented
 */
export async function trackEvent(data: AnalyticsEventData): Promise<void> {
  try {
    // Check if analytics consent is given
    const consent = await prisma.cookieConsent.findUnique({
      where: { sessionId: data.sessionId },
    })

    console.log('[Analytics Service] Checking consent', { 
      sessionId: data.sessionId, 
      hasConsent: !!consent, 
      analytics: consent?.analytics 
    })

    // Only track if analytics consent is given
    if (!consent?.analytics) {
      console.log('[Analytics Service] Not tracking - no analytics consent', { sessionId: data.sessionId })
      return
    }

    // Check if Prisma client has analyticsEvent model (might not be regenerated yet)
    if (!(prisma as any).analyticsEvent) {
      console.warn('[Analytics Service] Prisma client missing analyticsEvent model. Run: npx prisma generate && restart dev server')
      return
    }

    // Check if analytics_events table exists (Prisma client might not be regenerated yet)
    try {
      console.log('[Analytics Service] Creating analytics event', { pagePath: data.pagePath })
      await (prisma as any).analyticsEvent.create({
      data: {
        sessionId: data.sessionId,
        pagePath: data.pagePath,
        pageTitle: data.pageTitle,
        referrer: data.referrer || null,
        userAgent: data.userAgent || null,
        language: data.language,
        country: data.country,
        eventType: data.eventType || 'pageview',
        metadata: data.metadata || {},
      },
    })
      console.log('[Analytics Service] Event tracked successfully')
    } catch (dbError: any) {
      // Check if it's a "table doesn't exist" error
      if (dbError?.code === '42P01' || dbError?.message?.includes('does not exist')) {
        console.warn('[Analytics Service] Analytics table does not exist yet. Run: npx prisma db push && npx prisma generate')
      } else {
        throw dbError
      }
    }
  } catch (error) {
    // Silently fail analytics - don't break the user experience
    console.error('Analytics tracking error:', error)
  }
}

/**
 * Get analytics statistics
 */
export interface AnalyticsStats {
  totalPageViews: number
  uniqueVisitors: number
  popularPages: Array<{ path: string; views: number }>
  recentEvents: Array<{
    id: string
    pagePath: string
    pageTitle?: string
    createdAt: Date
  }>
  viewsByDay: Array<{ date: string; views: number }>
  viewsByPage: Array<{ path: string; views: number }>
}

export async function getAnalyticsStats(
  startDate?: Date,
  endDate?: Date
): Promise<AnalyticsStats> {
  const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Default: last 30 days
  const end = endDate || new Date()

  // Return empty stats if there's an error (e.g., table doesn't exist yet)
  const emptyStats: AnalyticsStats = {
    totalPageViews: 0,
    uniqueVisitors: 0,
    popularPages: [],
    recentEvents: [],
    viewsByDay: [],
    viewsByPage: [],
  }

  // Check if Prisma client has analyticsEvent model
  if (!(prisma as any).analyticsEvent) {
    console.warn('[Analytics Service] Prisma client missing analyticsEvent model. Run: npx prisma generate && restart dev server')
    return emptyStats
  }

  try {
    // Total page views
    const totalPageViews = await (prisma as any).analyticsEvent.count({
    where: {
      createdAt: { gte: start, lte: end },
      eventType: 'pageview',
    },
  })

    // Unique visitors (unique session IDs)
    const uniqueVisitors = await (prisma as any).analyticsEvent.groupBy({
    by: ['sessionId'],
    where: {
      createdAt: { gte: start, lte: end },
      eventType: 'pageview',
    },
    _count: true,
  })

    // Popular pages
    const popularPagesData = await (prisma as any).analyticsEvent.groupBy({
    by: ['pagePath'],
    where: {
      createdAt: { gte: start, lte: end },
      eventType: 'pageview',
    },
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: 'desc',
      },
    },
    take: 10,
  })

    const popularPages = popularPagesData.map((page: any) => ({
    path: page.pagePath,
    views: page._count.id,
  }))

    // Recent events
    const recentEvents = await (prisma as any).analyticsEvent.findMany({
    where: {
      createdAt: { gte: start, lte: end },
      eventType: 'pageview',
    },
    select: {
      id: true,
      pagePath: true,
      pageTitle: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 20,
  })

    // Views by day (last 30 days) - using Prisma groupBy for compatibility
    const allEvents = await (prisma as any).analyticsEvent.findMany({
    where: {
      createdAt: { gte: start, lte: end },
      eventType: 'pageview',
    },
    select: {
      createdAt: true,
    },
  })

    // Group by date
    const viewsByDayMap = new Map<string, number>()
    allEvents.forEach((event: any) => {
    const date = event.createdAt.toISOString().split('T')[0]
    viewsByDayMap.set(date, (viewsByDayMap.get(date) || 0) + 1)
  })

  const viewsByDay = Array.from(viewsByDayMap.entries())
    .map(([date, views]) => ({ date, views }))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 30)

    // Views by page path
    const viewsByPageData = await (prisma as any).analyticsEvent.groupBy({
    by: ['pagePath'],
    where: {
      createdAt: { gte: start, lte: end },
      eventType: 'pageview',
    },
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: 'desc',
      },
    },
  })

      const viewsByPage = viewsByPageData.map((page: any) => ({
      path: page.pagePath,
      views: page._count.id,
    }))

    return {
      totalPageViews,
      uniqueVisitors: uniqueVisitors.length,
      popularPages,
      recentEvents,
      viewsByDay,
      viewsByPage,
    }
  } catch (error) {
    // If table doesn't exist or any other error, return empty stats
    console.error('Error fetching analytics stats:', error)
    return emptyStats
  }
}

/**
 * Export analytics data as JSON
 */
export async function exportAnalyticsData(
  startDate?: Date,
  endDate?: Date
): Promise<any[]> {
  const start = startDate || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // Default: last year
  const end = endDate || new Date()

  // Check if Prisma client has analyticsEvent model
  if (!(prisma as any).analyticsEvent) {
    console.warn('[Analytics Service] Prisma client missing analyticsEvent model. Run: npx prisma generate && restart dev server')
    return []
  }

  try {
      const events = await (prisma as any).analyticsEvent.findMany({
      where: {
        createdAt: { gte: start, lte: end },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

      return events.map((event: any) => ({
      id: event.id,
      sessionId: event.sessionId,
      pagePath: event.pagePath,
      pageTitle: event.pageTitle,
      referrer: event.referrer,
      userAgent: event.userAgent,
      language: event.language,
      country: event.country,
      eventType: event.eventType,
      metadata: event.metadata,
      createdAt: event.createdAt.toISOString(),
    }))
  } catch (error) {
    // If table doesn't exist or any other error, return empty array
    console.error('Error exporting analytics data:', error)
    return []
  }
}

/**
 * Delete analytics data
 */
export async function deleteAnalyticsData(
  startDate?: Date,
  endDate?: Date
): Promise<number> {
  const start = startDate || new Date(0) // Default: all time
  const end = endDate || new Date()

  // Check if Prisma client has analyticsEvent model
  if (!(prisma as any).analyticsEvent) {
    console.warn('[Analytics Service] Prisma client missing analyticsEvent model. Run: npx prisma generate && restart dev server')
    return 0
  }

    const result = await (prisma as any).analyticsEvent.deleteMany({
    where: {
      createdAt: { gte: start, lte: end },
    },
  })

  return result.count
}

/**
 * Delete analytics data older than specified days
 */
export async function deleteOldAnalyticsData(daysOld: number = 365): Promise<number> {
  const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000)

  // Check if Prisma client has analyticsEvent model
  if (!(prisma as any).analyticsEvent) {
    console.warn('[Analytics Service] Prisma client missing analyticsEvent model. Run: npx prisma generate && restart dev server')
    return 0
  }

    const result = await (prisma as any).analyticsEvent.deleteMany({
    where: {
      createdAt: { lt: cutoffDate },
    },
  })

  return result.count
}

