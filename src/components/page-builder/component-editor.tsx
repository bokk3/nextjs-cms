'use client'

import { useState, useEffect } from 'react'
import { PageComponent, ComponentData, MultilingualText } from '@/types/page-builder'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MediaLibrary } from '@/components/admin/media-library'
import { RichTextEditor } from '@/components/admin/rich-text-editor'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'

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
            <Label htmlFor="description">Description ({languages.find(l => l.code === activeLanguage)?.name})</Label>
            <Input
              id="description"
              value={getMultilingualText('description', activeLanguage)}
              onChange={(e) => updateMultilingualText('description', activeLanguage, e.target.value)}
              placeholder="Enter hero description"
            />
          </div>
          
          <div className="border-t pt-4">
            <h5 className="font-medium text-gray-900 mb-3">Primary Button</h5>
            <div className="space-y-3">
              <div>
                <Label htmlFor="primaryButton">Button Text ({languages.find(l => l.code === activeLanguage)?.name})</Label>
                <Input
                  id="primaryButton"
                  value={getMultilingualText('primaryButton', activeLanguage)}
                  onChange={(e) => updateMultilingualText('primaryButton', activeLanguage, e.target.value)}
                  placeholder="Enter button text"
                />
              </div>
              <div>
                <Label htmlFor="primaryButtonLink">Button Link</Label>
                <Input
                  id="primaryButtonLink"
                  value={component.data.primaryButtonLink || component.data.heroButtonLink || ''}
                  onChange={(e) => updateData('primaryButtonLink', e.target.value)}
                  placeholder="/projects"
                />
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h5 className="font-medium text-gray-900 mb-3">Secondary Button</h5>
            <div className="space-y-3">
              <div>
                <Label htmlFor="secondaryButton">Button Text ({languages.find(l => l.code === activeLanguage)?.name})</Label>
                <Input
                  id="secondaryButton"
                  value={getMultilingualText('secondaryButton', activeLanguage)}
                  onChange={(e) => updateMultilingualText('secondaryButton', activeLanguage, e.target.value)}
                  placeholder="Enter button text"
                />
              </div>
              <div>
                <Label htmlFor="secondaryButtonLink">Button Link</Label>
                <Input
                  id="secondaryButtonLink"
                  value={component.data.secondaryButtonLink || ''}
                  onChange={(e) => updateData('secondaryButtonLink', e.target.value)}
                  placeholder="/contact"
                />
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h5 className="font-medium text-gray-900 mb-3">Background</h5>
            <div className="space-y-3">
              <div>
                <Label htmlFor="backgroundType">Background Type</Label>
                <Select
                  id="backgroundType"
                  value={component.data.backgroundType || 'solid'}
                  onChange={(e) => updateData('backgroundType', e.target.value)}
                >
                  <option value="solid">Solid Color</option>
                  <option value="gradient">Gradient</option>
                  <option value="image">Image</option>
                </Select>
              </div>
              
              {component.data.backgroundType === 'gradient' && (
                <div>
                  <Label htmlFor="gradient">Gradient Classes</Label>
                  <Input
                    id="gradient"
                    value={component.data.gradient || ''}
                    onChange={(e) => updateData('gradient', e.target.value)}
                    placeholder="from-white via-gray-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use Tailwind gradient classes (e.g., from-blue-500 via-purple-500 to-pink-500)
                  </p>
                </div>
              )}
              
              {component.data.backgroundType === 'image' && (
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
              )}
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h5 className="font-medium text-gray-900 mb-3">Layout</h5>
            <div className="space-y-3">
              <div>
                <Label htmlFor="height">Section Height</Label>
                <Select
                  id="height"
                  value={typeof component.data.height === 'string' ? component.data.height : 'auto'}
                  onChange={(e) => {
                    const value = e.target.value
                    updateData('height', value === 'auto' || value === 'screen' ? value : parseInt(value))
                  }}
                >
                  <option value="auto">Auto</option>
                  <option value="screen">Full Screen</option>
                </Select>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Features Component Fields */}
      {component.type === 'features' && (
        <>
          <div>
            <Label htmlFor="featuresTitle">Title ({languages.find(l => l.code === activeLanguage)?.name})</Label>
            <Input
              id="featuresTitle"
              value={getMultilingualText('title', activeLanguage)}
              onChange={(e) => updateMultilingualText('title', activeLanguage, e.target.value)}
              placeholder="Enter features section title"
            />
          </div>
          
          <div>
            <Label htmlFor="featuresSubtitle">Subtitle ({languages.find(l => l.code === activeLanguage)?.name})</Label>
            <Input
              id="featuresSubtitle"
              value={getMultilingualText('subtitle', activeLanguage)}
              onChange={(e) => updateMultilingualText('subtitle', activeLanguage, e.target.value)}
              placeholder="Enter features section subtitle"
            />
          </div>
          
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-medium text-gray-900">Features</h5>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const currentFeatures = component.data.features || []
                  const newFeature = {
                    icon: 'award',
                    title: { [activeLanguage]: '' },
                    description: { [activeLanguage]: '' }
                  }
                  updateData('features', [...currentFeatures, newFeature])
                }}
              >
                + Add Feature
              </Button>
            </div>
            
            <div className="space-y-4">
              {(component.data.features || []).map((feature: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h6 className="font-medium text-gray-700">Feature {index + 1}</h6>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentFeatures = component.data.features || []
                        updateData('features', currentFeatures.filter((_: any, i: number) => i !== index))
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                  
                  <div>
                    <Label htmlFor={`feature-icon-${index}`}>Icon</Label>
                    <Select
                      id={`feature-icon-${index}`}
                      value={feature.icon || 'award'}
                      onChange={(e) => {
                        const currentFeatures = component.data.features || []
                        const updatedFeatures = [...currentFeatures]
                        updatedFeatures[index] = { ...updatedFeatures[index], icon: e.target.value }
                        updateData('features', updatedFeatures)
                      }}
                    >
                      <option value="award">Award</option>
                      <option value="users">Users</option>
                      <option value="clock">Clock</option>
                      <option value="star">Star</option>
                      <option value="check">Check</option>
                      <option value="heart">Heart</option>
                      <option value="shield">Shield</option>
                      <option value="zap">Zap</option>
                      <option value="target">Target</option>
                      <option value="lightbulb">Lightbulb</option>
                      <option value="palette">Palette</option>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor={`feature-title-${index}`}>Title ({languages.find(l => l.code === activeLanguage)?.name})</Label>
                    <Input
                      id={`feature-title-${index}`}
                      value={typeof feature.title === 'string' ? feature.title : (feature.title?.[activeLanguage] || '')}
                      onChange={(e) => {
                        const currentFeatures = component.data.features || []
                        const updatedFeatures = [...currentFeatures]
                        const currentTitle = updatedFeatures[index].title || {}
                        updatedFeatures[index] = {
                          ...updatedFeatures[index],
                          title: { ...currentTitle, [activeLanguage]: e.target.value }
                        }
                        updateData('features', updatedFeatures)
                      }}
                      placeholder="Enter feature title"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`feature-description-${index}`}>Description ({languages.find(l => l.code === activeLanguage)?.name})</Label>
                    <Input
                      id={`feature-description-${index}`}
                      value={typeof feature.description === 'string' ? feature.description : (feature.description?.[activeLanguage] || '')}
                      onChange={(e) => {
                        const currentFeatures = component.data.features || []
                        const updatedFeatures = [...currentFeatures]
                        const currentDescription = updatedFeatures[index].description || {}
                        updatedFeatures[index] = {
                          ...updatedFeatures[index],
                          description: { ...currentDescription, [activeLanguage]: e.target.value }
                        }
                        updateData('features', updatedFeatures)
                      }}
                      placeholder="Enter feature description"
                    />
                  </div>
                </div>
              ))}
              
              {(!component.data.features || component.data.features.length === 0) && (
                <p className="text-sm text-gray-500 text-center py-4">No features added yet. Click "Add Feature" to get started.</p>
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
        <>
          <div>
            <Label htmlFor="galleryTitle">Title ({languages.find(l => l.code === activeLanguage)?.name})</Label>
            <Input
              id="galleryTitle"
              value={getMultilingualText('title', activeLanguage)}
              onChange={(e) => updateMultilingualText('title', activeLanguage, e.target.value)}
              placeholder="Enter gallery title"
            />
          </div>
          
          <div>
            <Label htmlFor="gallerySubtitle">Subtitle ({languages.find(l => l.code === activeLanguage)?.name})</Label>
            <Input
              id="gallerySubtitle"
              value={getMultilingualText('subtitle', activeLanguage)}
              onChange={(e) => updateMultilingualText('subtitle', activeLanguage, e.target.value)}
              placeholder="Enter gallery subtitle"
            />
          </div>
          
          <div className="border-t pt-4">
            <h5 className="font-medium text-gray-900 mb-3">Content Source</h5>
            <div className="space-y-3">
              <div>
                <Label htmlFor="showFeatured">Display Featured Projects</Label>
                <Select
                  id="showFeatured"
                  value={component.data.showFeatured ? 'true' : 'false'}
                  onChange={(e) => updateData('showFeatured', e.target.value === 'true')}
                >
                  <option value="false">Custom Images</option>
                  <option value="true">Featured Projects</option>
                </Select>
              </div>
              
              {!component.data.showFeatured && (
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
            </div>
          </div>
          
          {component.data.showFeatured && (
            <div className="border-t pt-4">
              <h5 className="font-medium text-gray-900 mb-3">Display Options</h5>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="maxItems">Max Items</Label>
                  <Input
                    id="maxItems"
                    type="number"
                    value={component.data.maxItems || 8}
                    onChange={(e) => updateData('maxItems', parseInt(e.target.value) || 8)}
                    min="1"
                    max="20"
                  />
                </div>
                
                <div>
                  <Label htmlFor="layout">Layout</Label>
                  <Select
                    id="layout"
                    value={component.data.layout || 'grid'}
                    onChange={(e) => updateData('layout', e.target.value)}
                  >
                    <option value="grid">Grid</option>
                    <option value="masonry">Masonry</option>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="columns">Columns</Label>
                  <Select
                    id="columns"
                    value={component.data.columns || 3}
                    onChange={(e) => updateData('columns', parseInt(e.target.value))}
                  >
                    <option value="2">2 Columns</option>
                    <option value="3">3 Columns</option>
                    <option value="4">4 Columns</option>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* CTA Component Fields */}
      {component.type === 'cta' && (
        <>
          <div>
            <Label htmlFor="heading">Heading ({languages.find(l => l.code === activeLanguage)?.name})</Label>
            <Input
              id="heading"
              value={component.data.heading?.[activeLanguage] || component.data.title?.[activeLanguage] || ''}
              onChange={(e) => {
                const updatedHeading = { ...component.data.heading, [activeLanguage]: e.target.value }
                updateData('heading', updatedHeading)
              }}
              placeholder="Enter CTA heading"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description ({languages.find(l => l.code === activeLanguage)?.name})</Label>
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
          
          <div className="border-t pt-4">
            <h5 className="font-medium text-gray-900 mb-3">Primary Button</h5>
            <div className="space-y-3">
              <div>
                <Label htmlFor="ctaButtonText">Button Text ({languages.find(l => l.code === activeLanguage)?.name})</Label>
                <Input
                  id="ctaButtonText"
                  value={component.data.ctaButtonText?.[activeLanguage] || component.data.primaryButton?.[activeLanguage] || ''}
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
                  placeholder="/contact"
                />
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h5 className="font-medium text-gray-900 mb-3">Secondary Button</h5>
            <div className="space-y-3">
              <div>
                <Label htmlFor="secondaryButton">Button Text ({languages.find(l => l.code === activeLanguage)?.name})</Label>
                <Input
                  id="secondaryButton"
                  value={getMultilingualText('secondaryButton', activeLanguage)}
                  onChange={(e) => updateMultilingualText('secondaryButton', activeLanguage, e.target.value)}
                  placeholder="Enter button text"
                />
              </div>
              <div>
                <Label htmlFor="secondaryButtonLink">Button Link</Label>
                <Input
                  id="secondaryButtonLink"
                  value={component.data.secondaryButtonLink || ''}
                  onChange={(e) => updateData('secondaryButtonLink', e.target.value)}
                  placeholder="/projects"
                />
              </div>
            </div>
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
        
        <div className="space-y-4">
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
          
          <div className="border-t pt-3">
            <Label className="mb-2 block">Padding (px)</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="paddingTop" className="text-xs text-gray-600">Top</Label>
                <Input
                  id="paddingTop"
                  type="number"
                  value={component.data.padding?.top || 0}
                  onChange={(e) => {
                    const currentPadding = component.data.padding || { top: 0, right: 0, bottom: 0, left: 0 }
                    updateData('padding', { ...currentPadding, top: parseInt(e.target.value) || 0 })
                  }}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="paddingRight" className="text-xs text-gray-600">Right</Label>
                <Input
                  id="paddingRight"
                  type="number"
                  value={component.data.padding?.right || 0}
                  onChange={(e) => {
                    const currentPadding = component.data.padding || { top: 0, right: 0, bottom: 0, left: 0 }
                    updateData('padding', { ...currentPadding, right: parseInt(e.target.value) || 0 })
                  }}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="paddingBottom" className="text-xs text-gray-600">Bottom</Label>
                <Input
                  id="paddingBottom"
                  type="number"
                  value={component.data.padding?.bottom || 0}
                  onChange={(e) => {
                    const currentPadding = component.data.padding || { top: 0, right: 0, bottom: 0, left: 0 }
                    updateData('padding', { ...currentPadding, bottom: parseInt(e.target.value) || 0 })
                  }}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="paddingLeft" className="text-xs text-gray-600">Left</Label>
                <Input
                  id="paddingLeft"
                  type="number"
                  value={component.data.padding?.left || 0}
                  onChange={(e) => {
                    const currentPadding = component.data.padding || { top: 0, right: 0, bottom: 0, left: 0 }
                    updateData('padding', { ...currentPadding, left: parseInt(e.target.value) || 0 })
                  }}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}