'use client'

import { useState, useEffect } from 'react'
import { ProjectWithRelations, CreateProjectRequest, UpdateProjectRequest } from '@/types/project'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { ImageUploader } from './image-uploader'

interface ProjectFormProps {
  project?: ProjectWithRelations
  onSave: () => void
  onCancel: () => void
}

interface ContentType {
  id: string
  name: string
  displayName: string
}

interface Language {
  id: string
  code: string
  name: string
  isDefault: boolean
  isActive: boolean
}

interface Translation {
  languageId: string
  title: string
  description: string
  materials: string[]
}

interface ProjectImage {
  id?: string
  originalUrl: string
  thumbnailUrl: string
  alt: string
  order: number
}

export function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
  const [contentTypes, setContentTypes] = useState<ContentType[]>([])
  const [languages, setLanguages] = useState<Language[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [contentTypeId, setContentTypeId] = useState('')
  const [featured, setFeatured] = useState(false)
  const [published, setPublished] = useState(true)
  const [translations, setTranslations] = useState<Translation[]>([])
  const [images, setImages] = useState<ProjectImage[]>([])

  // Initialize form with project data if editing
  useEffect(() => {
    if (project) {
      setContentTypeId(project.contentTypeId)
      setFeatured(project.featured)
      setPublished(project.published)
      setTranslations(
        project.translations.map(t => ({
          languageId: t.languageId,
          title: t.title,
          description: typeof t.description === 'string' ? t.description : JSON.stringify(t.description),
          materials: t.materials
        }))
      )
      setImages(
        project.images.map(img => ({
          id: img.id,
          originalUrl: img.originalUrl,
          thumbnailUrl: img.thumbnailUrl,
          alt: img.alt,
          order: img.order
        }))
      )
    }
  }, [project])

  // Fetch content types and languages
  useEffect(() => {
    const fetchData = async () => {
      try {
        // For now, we'll create mock data since we haven't implemented these endpoints yet
        setContentTypes([
          { id: '1', name: 'projects', displayName: 'Projects' }
        ])
        setLanguages([
          { id: '1', code: 'nl', name: 'Nederlands', isDefault: true, isActive: true },
          { id: '2', code: 'fr', name: 'Français', isDefault: false, isActive: true }
        ])

        // Initialize translations for active languages if creating new project
        if (!project) {
          setTranslations([
            { languageId: '1', title: '', description: '', materials: [] },
            { languageId: '2', title: '', description: '', materials: [] }
          ])
          setContentTypeId('1')
        }
      } catch (err) {
        setError('Failed to load form data')
      }
    }

    fetchData()
  }, [project])

  const handleTranslationChange = (languageId: string, field: keyof Translation, value: any) => {
    setTranslations(prev => 
      prev.map(t => 
        t.languageId === languageId 
          ? { ...t, [field]: value }
          : t
      )
    )
  }

  const handleMaterialsChange = (languageId: string, materialsText: string) => {
    const materials = materialsText.split(',').map(m => m.trim()).filter(m => m)
    handleTranslationChange(languageId, 'materials', materials)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate required fields
      const validTranslations = translations.filter(t => t.title.trim())
      if (validTranslations.length === 0) {
        throw new Error('At least one translation with a title is required')
      }

      const requestData = {
        contentTypeId,
        featured,
        published,
        translations: validTranslations.map(t => ({
          languageId: t.languageId,
          title: t.title,
          description: t.description || '',
          materials: t.materials
        })),
        images: images.map(img => ({
          originalUrl: img.originalUrl,
          thumbnailUrl: img.thumbnailUrl,
          alt: img.alt,
          order: img.order
        }))
      }

      const url = project ? `/api/projects/${project.id}` : '/api/projects'
      const method = project ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save project')
      }

      onSave()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getLanguageName = (languageId: string) => {
    const language = languages.find(l => l.id === languageId)
    return language?.name || 'Unknown Language'
  }

  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {project ? 'Edit Project' : 'Create Project'}
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="text-red-800">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Settings */}
        <div className="bg-white p-6 border border-gray-200 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Basic Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Type
              </label>
              <Select
                value={contentTypeId}
                onChange={(e) => setContentTypeId(e.target.value)}
                required
              >
                <option value="">Select content type</option>
                {contentTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.displayName}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="mr-2"
                />
                Featured
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="mr-2"
                />
                Published
              </label>
            </div>
          </div>
        </div>

        {/* Translations */}
        <div className="bg-white p-6 border border-gray-200 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Translations</h2>
          <div className="space-y-6">
            {translations.map((translation, index) => (
              <div key={translation.languageId} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium mb-4">
                  {getLanguageName(translation.languageId)}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <Input
                      value={translation.title}
                      onChange={(e) => handleTranslationChange(translation.languageId, 'title', e.target.value)}
                      placeholder="Project title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <Textarea
                      value={translation.description}
                      onChange={(e) => handleTranslationChange(translation.languageId, 'description', e.target.value)}
                      placeholder="Project description"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Materials (comma-separated)
                    </label>
                    <Input
                      value={translation.materials.join(', ')}
                      onChange={(e) => handleMaterialsChange(translation.languageId, e.target.value)}
                      placeholder="Wood, Metal, Glass"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="bg-white p-6 border border-gray-200 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Images</h2>
          <ImageUploader
            images={images}
            onImagesChange={setImages}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Saving...' : (project ? 'Update Project' : 'Create Project')}
          </Button>
        </div>
      </form>
    </div>
  )
}