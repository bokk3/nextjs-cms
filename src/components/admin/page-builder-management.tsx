'use client'

import { useState, useEffect } from 'react'
import { PageBuilder } from '@/components/page-builder/page-builder'
import { PageComponent } from '@/types/page-builder'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, Eye } from 'lucide-react'

export function PageBuilderManagement() {
  const [components, setComponents] = useState<PageComponent[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadHomepageComponents()
  }, [])

  const loadHomepageComponents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/page-builder/homepage')
      if (response.ok) {
        const data = await response.json()
        setComponents(data.components || [])
      }
    } catch (error) {
      console.error('Error loading homepage components:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (newComponents: PageComponent[]) => {
    try {
      setSaving(true)
      const response = await fetch('/api/page-builder/homepage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          components: newComponents
        })
      })

      if (response.ok) {
        setComponents(newComponents)
        alert('Homepage saved successfully!')
      } else {
        alert('Failed to save homepage')
      }
    } catch (error) {
      console.error('Error saving homepage:', error)
      alert('Failed to save homepage')
    } finally {
      setSaving(false)
    }
  }

  const handlePreview = () => {
    window.open('/', '_blank')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading page builder...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col animate-fade-in">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Homepage Builder</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handlePreview}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview Site
            </Button>
          </div>
        </div>
      </div>

      {/* Page Builder */}
      <div className="flex-1">
        <PageBuilder
          initialComponents={components}
          onSave={handleSave}
          onPreview={handlePreview}
        />
      </div>
    </div>
  )
}