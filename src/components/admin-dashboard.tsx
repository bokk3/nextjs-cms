"use client"

import { useState, useEffect } from 'react'
import { useSession } from "../lib/auth-client"
import Link from "next/link"
import { VisitsTicker } from './admin/visits-ticker'
import { StatsCard } from './admin/stats-card'
import { AnalyticsChart } from './admin/analytics-chart'
import { ServerStats } from './admin/server-stats'

interface DashboardStats {
  projects: {
    total: number
    published: number
    unpublished: number
    recent: number
  }
  content: {
    total: number
    published: number
    unpublished: number
    recent: number
  }
  messages: {
    total: number
    unread: number
    read: number
    recent: number
  }
  users: {
    total: number
  }
  analytics: {
    totalPageViews: number
    uniqueVisitors: number
    viewsByDay: Array<{ date: string; views: number }>
    popularPages: Array<{ path: string; views: number }>
  }
  server: {
    uptime: string
    uptimeSeconds: number
    nodeVersion: string
    platform: string
    memory: {
      used: number
      total: number
      rss: number
    }
  }
}

export function AdminDashboard() {
  const { data: session, isPending } = useSession()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        if (!response.ok) {
          throw new Error('Failed to fetch stats')
        }
        const data = await response.json()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stats')
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchStats()
      // Refresh stats every 30 seconds
      const interval = setInterval(fetchStats, 30000)
      return () => clearInterval(interval)
    }
  }, [session])

  if (isPending || loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to be signed in to access the admin panel.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Admin Dashboard
        </h1>
      </div>

      {/* Visits Ticker with Clock */}
      {stats && (
        <VisitsTicker initialCount={stats.analytics.totalPageViews} />
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats && (
          <>
            <StatsCard
              title="Projects"
              value={stats.projects.total}
              subtitle={`${stats.projects.published} published, ${stats.projects.unpublished} drafts`}
              trend={stats.projects.recent > 0 ? { value: stats.projects.recent, label: 'this week', positive: true } : undefined}
              icon={
                <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              }
            />
            <StatsCard
              title="Content Pages"
              value={stats.content.total}
              subtitle={`${stats.content.published} published, ${stats.content.unpublished} drafts`}
              trend={stats.content.recent > 0 ? { value: stats.content.recent, label: 'this week', positive: true } : undefined}
              icon={
                <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />
            <StatsCard
              title="Messages"
              value={stats.messages.total}
              subtitle={`${stats.messages.unread} unread, ${stats.messages.read} read`}
              trend={stats.messages.unread > 0 ? { value: stats.messages.unread, label: 'unread', positive: false } : undefined}
              icon={
                <svg className="h-8 w-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />
            <StatsCard
              title="Users"
              value={stats.users.total}
              subtitle="Total registered users"
              icon={
                <svg className="h-8 w-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              }
            />
          </>
        )}
      </div>

      {/* Analytics and Server Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stats && (
          <>
            <AnalyticsChart
              data={stats.analytics.viewsByDay}
              title="Page Views (Last 7 Days)"
            />
            <ServerStats
              uptime={stats.server.uptime}
              memory={stats.server.memory}
              nodeVersion={stats.server.nodeVersion}
              platform={stats.server.platform}
            />
          </>
        )}
      </div>

      {/* Popular Pages */}
      {stats && stats.analytics.popularPages.length > 0 && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Popular Pages (30 days)
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {stats.analytics.popularPages.map((page, index) => (
                <div key={page.path} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-6">
                      #{index + 1}
                    </span>
                    <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                      {page.path}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {page.views.toLocaleString()} views
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-4">
            Quick Actions
          </h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/projects"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Manage Projects
            </Link>
            <Link
              href="/admin/content"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Manage Content
            </Link>
            <Link
              href="/admin/messages"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Contact Messages
            </Link>
            <Link
              href="/admin/analytics"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Analytics
            </Link>
            <Link
              href="/admin/settings"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}