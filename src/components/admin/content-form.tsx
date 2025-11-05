'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RichTextEditor } from './rich-text-editor'
import { ContentPageFormData, ContentTranslationFormData, JSONContent } from '@/types/content'
import { ContentValidator } from '@/lib/content-validation'
import { ContentService } from '@/lib/content-service'
import { Save, Eye, Globe, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

interface ContentFormProps {
  initialData?: ContentPageFormData
  languages: Array<{ id: string; code: string; name: string; isDefault: boolean }>
  onSave: (data: ContentPageFormData) => Promise<void>
  onPreview?: (data: ContentPageFormData, languageCode: string) => void
  isLoading?: boolean
  mode?: 'create' | 'edit'
}

export function ContentForm({
  initialData,
  languages,
  onSave,
  onPreview,
  isLoading = false,
  mode = 'create'
}: ContentFormProps) {
  const [formData, setFormData] = useState<ContentPageFormData>(() => ({
    slug: initialData?.slug || '',
    published: initialData?.published || false,
    translations: initialData?.translations || languages.map(lang => ({
      languageId: lang.id,
      title: '',
      content: {
        type: 'doc',
        content: [{ type: 'paragraph', content: [] }]
      }
    }))
  }))

  const [activeLanguage, setActiveLanguage] = useState(
    languages.find(l => l.isDefault)?.code || languages[0]?.code || 'nl'
  )
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [slugValidation, setSlugValidation] = useState<{
    isValid: boolean
    isAvailable: boolean
    error?: string
    suggestions?: string[]
  } | null>(null)
  const [isValidatingSlug, setIsValidatingSlug] = useState(false)

  // Get current translation
  const currentTranslation = formData.translations.find(t => {
    const lang = languages.find(l => l.id === t.languageId)
    return lang?.code === activeLanguage
  })

  // Validate slug when it changes
  useEffect(() => {
    const validateSlug = async () => {
      if (!formData.slug || formData.slug.length < 2) {
        setSlugValidation(null)
        return
      }

      setIsValidatingSlug(true)
      try {
        const response = await fetch('/api/content/validate-slug', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug: formData.slug,
            excludeId: mode === 'edit' ? initialData?.slug : undefined
          })
        })

        if (response.ok) {
          const result = await response.json()
          setSlugValidation(result)
        }
      } catch (error) {
        console.error('Error validating slug:', error)
      } finally {
        setIsValidatingSlug(false)
      }
    }

    const timeoutId = setTimeout(validateSlug, 500)
    return () => clearTimeout(timeoutId)
  }, [formData.slug, mode, initialData?.slug])

  const updateSlug = (value: string) => {
    setFormData(prev => ({ ...prev, slug: value }))
  }

  const generateSlugFromTitle = () => {
    if (currentTranslation?.title) {
      const generatedSlug = ContentService.generateSlug(currentTranslation.title)
      updateSlug(generatedSlug)
    }
  }

  const updateTranslation = (field: keyof ContentTranslationFormData, value: any) => {
    if (!currentTranslation) return

    setFormData(prev => ({
      ...prev,
      translations: prev.translations.map(t => {
        const lang = languages.find(l => l.id === t.languageId)
        if (lang?.code === activeLanguage) {
          return { ...t, [field]: value }
        }
        return t
      })
    }))
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    // Validate slug
    if (!formData.slug) {
      errors.slug = 'Slug is required'
    } else if (!ContentValidator.isValidSlug(formData.slug)) {
      errors.slug = 'Invalid slug format'
    } else if (slugValidation && !slugValidation.isAvailable) {
      errors.slug = 'Slug is not available'
    }

    // Validate translations
    formData.translations.forEach((translation, index) => {
      const lang = languages.find(l => l.id === translation.languageId)
      if (!lang) return

      if (!translation.title.trim()) {
        errors[`translation_${lang.code}_title`] = `Title is required for ${lang.name}`
      }

      if (!translation.content || ContentValidator.extractPlainText(translation.content).trim().length === 0) {
        errors[`translation_${lang.code}_content`] = `Content is required for ${lang.name}`
      }
    })

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    try {
      await onSave(formData)
    } catch (error) {
      console.error('Error saving content:', error)
    }
  }

  const handlePreview = () => {
    if (onPreview) {
      onPreview(formData, activeLanguage)
    }
  }

  const getSlugStatus = () => {
    if (isValidatingSlug) {
      return <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
    }

    if (!slugValidation) {
      return null
    }

    if (slugValidation.isValid && slugValidation.isAvailable) {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }

    return <AlertCircle className="h-4 w-4 text-red-500" />
  }

  return (
    <div className="space-y-6">
      {/* Page Settings */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Page Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  value={formData.slug}
                  onChange={(e) => updateSlug(e.target.value)}
                  placeholder="page-slug"
                  className={validationErrors.slug ? 'border-red-500' : ''}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {getSlugStatus()}
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={generateSlugFromTitle}
                disabled={!currentTranslation?.title}
              >
                Generate from Title
              </Button>
            </div>
            {validationErrors.slug && (
              <p className="text-sm text-red-600 mt-1">{validationErrors.slug}</p>
            )}
            {slugValidation?.error && (
              <p className="text-sm text-red-600 mt-1">{slugValidation.error}</p>
            )}
            {slugValidation?.suggestions && slugValidation.suggestions.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Suggestions:</p>
                <div className="flex gap-2 mt-1">
                  {slugValidation.suggestions.slice(0, 3).map(suggestion => (
                    <Button
                      key={suggestion}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateSlug(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <label htmlFor="published" className="text-sm font-medium text-gray-700">
              Published
            </label>
          </div>
        </div>
      </div>

      {/* Language Tabs */}
      <div className="bg-white rounded-lg border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {languages.map(language => {
              const translation = formData.translations.find(t => t.languageId === language.id)
              const hasContent = translation?.title || (translation?.content && 
                ContentValidator.extractPlainText(translation.content).trim().length > 0)
              
              return (
                <button
                  key={language.code}
                  type="button"
                  onClick={() => setActiveLanguage(language.code)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeLanguage === language.code
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Globe className="h-4 w-4" />
                  {language.name}
                  {language.isDefault && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Default
                    </span>
                  )}
                  {hasContent && (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Translation Content */}
        <div className="p-6">
          {currentTranslation && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title ({languages.find(l => l.code === activeLanguage)?.name})
                </label>
                <Input
                  value={currentTranslation.title}
                  onChange={(e) => updateTranslation('title', e.target.value)}
                  placeholder="Enter page title..."
                  className={validationErrors[`translation_${activeLanguage}_title`] ? 'border-red-500' : ''}
                />
                {validationErrors[`translation_${activeLanguage}_title`] && (
                  <p className="text-sm text-red-600 mt-1">
                    {validationErrors[`translation_${activeLanguage}_title`]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content ({languages.find(l => l.code === activeLanguage)?.name})
                </label>
                <RichTextEditor
                  content={currentTranslation.content}
                  onChange={(content) => updateTranslation('content', content)}
                  placeholder={`Write content in ${languages.find(l => l.code === activeLanguage)?.name}...`}
                  className={validationErrors[`translation_${activeLanguage}_content`] ? 'border-red-500' : ''}
                />
                {validationErrors[`translation_${activeLanguage}_content`] && (
                  <p className="text-sm text-red-600 mt-1">
                    {validationErrors[`translation_${activeLanguage}_content`]}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <div className="flex gap-2">
          {onPreview && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePreview}
              disabled={isLoading}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {mode === 'create' ? 'Create Page' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  )
}