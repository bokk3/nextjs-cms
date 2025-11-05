'use client'

import { useState, useEffect } from 'react'
import { PageComponent, ComponentData, MultilingualText } from '@/types/page-builder'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MediaLibrary } from '@/components/admin/media-library'
import { RichTextEditor } from '@/components/admin/rich-text-editor'
import { Label } from '@/components/ui/label'

interface Language {
  id: string
  code: string
  name: string
  isDefault: boolean
  isActive: boolean
}

interface ComponentEditorProps {
  component: PageComponent
  onChange: (data: ComponentData) => void
}

export function ComponentEditor({ component, onChange }: ComponentEditorProps) {
  const [showMediaLibrary, setShowMediaLibrary] = useState(false)
  const [mediaSelectionMode, setMediaSelectionMode] = useState<'single' | 'multiple'>('single')
  const [mediaTarget, setMediaTarget] = useState<string>('')
  const [languages, setLanguages] = useState<Language[]>([])
  const [activeLanguage, setActiveLanguage] = useState('nl')

  // Fetch available languages
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch('/api/languages')
        if (response.ok) {
          const langs = await response.json()
          setLanguages(langs)
          const defaultLang = langs.find((l: Language) => l.isDefault)
          setActiveLanguage(defaultLang?.code || 'nl')
        }
      } catch (error) {
        console.error('Error fetching languages:', error)
      }
    }
    fetchLanguages()
  }, [])

  const updateData = (key: string, value: any) => {
    onChange({
      ...component.data,
      [key]: value
    })
  }

  const updateMultilingualText = (key: string, languageCode: string, value: string) => {
    const currentValue = component.data[key as keyof ComponentData] as MultilingualText | undefined
    const updatedValue = {
      ...currentValue,
      [languageCode]: value
    }
    updateData(key, updatedValue)
  }

  const getMultilingualText = (key: string, languageCode: string): string => {
    const value = component.data[key as keyof ComponentData] as MultilingualText | string | undefined
    if (!value) return ''
    if (typeof value === 'string') return value
    return value[languageCode] || ''
  }

  const handleMediaSelect = (media: any) => {
    if (mediaTarget === 'backgroundImage' || mediaTarget === 'imageUrl') {
      updateData(mediaTarget, media.originalUrl)
    }
    setShowMediaLibrary(false)
  }

  const handleMediaSelectMultiple = (mediaList: any[]) => {
    if (mediaTarget === 'images') {
      const images = mediaList.map(media => ({
        id: media.id,
        url: media.originalUrl,
        alt: media.alt,
        caption: ''
      }))
      updateData('images', images)
    }
    setShowMediaLibrary(false)
  }

  const openMediaLibrary = (target: string, mode: 'single' | 'multiple' = 'single') => {
    setMediaTarget(target)
    setMediaSelectionMode(mode)
    setShowMediaLibrary(true)
  }

  if (showMediaLibrary) {
    return (
      <div className="p-4">
        <div className="mb-4">
          <Button
            variant="outline"
            onClick={() => setShowMediaLibrary(false)}
          >
            ← Back to Editor
          </Button>
        </div>
        
        <MediaLibrary
          selectionMode={mediaSelectionMode}
          onSelect={mediaSelectionMode === 'single' ? handleMediaSelect : undefined}
          onSelectMultiple={mediaSelectionMode === 'multiple' ? handleMediaSelectMultiple : undefined}
          allowUpload={true}
        />
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <h4 className="font-medium text-gray-900 mb-2">
          {component.type.charAt(0).toUpperCase() + component.type.slice(1)} Component
        </h4>
      </div>

      {/* Language Tabs */}
      {languages.length > 1 && (
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4">
            {languages.map(language => (
              <button
                key={language.code}
                type="button"
                onClick={() => setActiveLanguage(language.code)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeLanguage === language.code
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {language.name}
                {language.isDefault && (
                  <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">
                    Default
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Hero Component Fields */}
      {component.type === 'hero' && (
        <>
          <div>
            <Label htmlFor="title">Title ({languages.find(l => l.code === activeLanguage)?.name})</Label>
            <Input
              id="title"
              value={getMultilingualText('title', activeLanguage)}
              onChange={(e) => updateMultilingualText('title', activeLanguage, e.target.value)}
              placeholder="Enter hero title"
            />
          </div>
          
          <div>
            <Label htmlFor="subtitle">Subtitle ({languages.find(l => l.code === activeLanguage)?.name})</Label>
            <Input
              id="subtitle"
              value={getMultilingualText('subtitle', activeLanguage)}
              onChange={(e) => updateMultilingualText('subtitle', activeLanguage, e.target.value)}
              placeholder="Enter hero subtitle"
            />
          </div>
          
          <div>
            <Label htmlFor="heroButtonText">Button Text ({languages.find(l => l.code === activeLanguage)?.name})</Label>
            <Input
              id="heroButtonText"
              value={getMultilingualText('heroButtonText', activeLanguage)}
              onChange={(e) => updateMultilingualText('heroButtonText', activeLanguage, e.target.value)}
              placeholder="Enter button text"
            />
          </div>
          
          <div>
            <Label htmlFor="heroButtonLink">Button Link</Label>
            <Input
              id="heroButtonLink"
              value={component.data.heroButtonLink || ''}
              onChange={(e) => updateData('heroButtonLink', e.target.value)}
              placeholder="Enter button link"
            />
          </div>
          
          <div>
            <Label>Background Image</Label>
            <div className="mt-2">
              {component.data.backgroundImage ? (
                <div className="flex items-center gap-2">
                  <img 
                    src={component.data.backgroundImage} 
                    alt="Background" 
                    className="w-16 h-16 object-cover rounded"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateData('backgroundImage', '')}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => openMediaLibrary('backgroundImage')}
                >
                  Select Image
                </Button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Text Component Fields */}
      {component.type === 'text' && (
        <>
          <div>
            <Label>Content</Label>
            <div className="mt-2">
              <RichTextEditor
                content={component.data.content?.[activeLanguage] ? { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: component.data.content[activeLanguage] }] }] } : undefined}
                onChange={(content) => {
                  // Extract plain text from TipTap content for now
                  const text = content.content?.[0]?.content?.[0]?.text || ''
                  const updatedContent = { ...component.data.content, [activeLanguage]: text }
                  updateData('content', updatedContent)
                }}
                placeholder="Enter your text content..."
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="alignment">Text Alignment</Label>
            <select
              id="alignment"
              value={component.data.alignment || 'left'}
              onChange={(e) => updateData('alignment', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </>
      )}

      {/* Image Component Fields */}
      {component.type === 'image' && (
        <>
          <div>
            <Label>Image</Label>
            <div className="mt-2">
              {component.data.imageUrl ? (
                <div className="space-y-2">
                  <img 
                    src={component.data.imageUrl} 
                    alt="Selected" 
                    className="w-full h-32 object-cover rounded"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openMediaLibrary('imageUrl')}
                    >
                      Change Image
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateData('imageUrl', '')}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => openMediaLibrary('imageUrl')}
                >
                  Select Image
                </Button>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="alt">Alt Text</Label>
            <Input
              id="alt"
              value={component.data.alt?.[activeLanguage] || ''}
              onChange={(e) => {
                const updatedAlt = { ...component.data.alt, [activeLanguage]: e.target.value }
                updateData('alt', updatedAlt)
              }}
              placeholder="Describe the image"
            />
          </div>
          
          <div>
            <Label htmlFor="caption">Caption</Label>
            <Input
              id="caption"
              value={component.data.caption?.[activeLanguage] || ''}
              onChange={(e) => {
                const updatedCaption = { ...component.data.caption, [activeLanguage]: e.target.value }
                updateData('caption', updatedCaption)
              }}
              placeholder="Optional image caption"
            />
          </div>
        </>
      )}

      {/* Gallery Component Fields */}
      {component.type === 'gallery' && (
        <div>
          <Label>Gallery Images</Label>
          <div className="mt-2">
            {component.data.images && component.data.images.length > 0 ? (
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  {component.data.images.map((image, index) => (
                    <img 
                      key={image.id || index}
                      src={image.url} 
                      alt={image.alt} 
                      className="w-full h-16 object-cover rounded"
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openMediaLibrary('images', 'multiple')}
                  >
                    Change Images
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateData('images', [])}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => openMediaLibrary('images', 'multiple')}
              >
                Select Images
              </Button>
            )}
          </div>
        </div>
      )}

      {/* CTA Component Fields */}
      {component.type === 'cta' && (
        <>
          <div>
            <Label htmlFor="heading">Heading</Label>
            <Input
              id="heading"
              value={component.data.heading?.[activeLanguage] || ''}
              onChange={(e) => {
                const updatedHeading = { ...component.data.heading, [activeLanguage]: e.target.value }
                updateData('heading', updatedHeading)
              }}
              placeholder="Enter CTA heading"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={component.data.description?.[activeLanguage] || ''}
              onChange={(e) => {
                const updatedDescription = { ...component.data.description, [activeLanguage]: e.target.value }
                updateData('description', updatedDescription)
              }}
              placeholder="Enter CTA description"
            />
          </div>
          
          <div>
            <Label htmlFor="ctaButtonText">Button Text</Label>
            <Input
              id="ctaButtonText"
              value={component.data.ctaButtonText?.[activeLanguage] || ''}
              onChange={(e) => {
                const updatedButtonText = { ...component.data.ctaButtonText, [activeLanguage]: e.target.value }
                updateData('ctaButtonText', updatedButtonText)
              }}
              placeholder="Enter button text"
            />
          </div>
          
          <div>
            <Label htmlFor="ctaButtonLink">Button Link</Label>
            <Input
              id="ctaButtonLink"
              value={component.data.ctaButtonLink || ''}
              onChange={(e) => updateData('ctaButtonLink', e.target.value)}
              placeholder="Enter button link"
            />
          </div>
        </>
      )}

      {/* Spacer Component Fields */}
      {component.type === 'spacer' && (
        <div>
          <Label htmlFor="height">Height (px)</Label>
          <Input
            id="height"
            type="number"
            value={component.data.height || 60}
            onChange={(e) => updateData('height', parseInt(e.target.value) || 60)}
            min="10"
            max="500"
          />
        </div>
      )}

      {/* Common Style Fields */}
      <div className="border-t pt-4">
        <h5 className="font-medium text-gray-900 mb-3">Styling</h5>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="backgroundColor">Background Color</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="backgroundColor"
                type="color"
                value={component.data.backgroundColor || '#ffffff'}
                onChange={(e) => updateData('backgroundColor', e.target.value)}
                className="w-16 h-10 p-1"
              />
              <Input
                value={component.data.backgroundColor || '#ffffff'}
                onChange={(e) => updateData('backgroundColor', e.target.value)}
                placeholder="#ffffff"
                className="flex-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="textColor">Text Color</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="textColor"
                type="color"
                value={component.data.textColor || '#000000'}
                onChange={(e) => updateData('textColor', e.target.value)}
                className="w-16 h-10 p-1"
              />
              <Input
                value={component.data.textColor || '#000000'}
                onChange={(e) => updateData('textColor', e.target.value)}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}