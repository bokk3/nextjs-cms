'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ImageUploader } from './image-uploader'
import { 
  Upload, 
  Search, 
  Grid, 
  List, 
  Trash2, 
  Download, 
  Eye,
  X,
  Check,
  Filter
} from 'lucide-react'

interface MediaItem {
  id: string
  originalUrl: string
  thumbnailUrl: string
  alt: string
  filename: string
  size: number
  width: number
  height: number
  createdAt: string
}

interface MediaLibraryProps {
  onSelect?: (media: MediaItem) => void
  onSelectMultiple?: (media: MediaItem[]) => void
  allowMultiple?: boolean
  selectedItems?: MediaItem[]
  mode?: 'select' | 'manage'
  onClose?: () => void
}

export function MediaLibrary({
  onSelect,
  onSelectMultiple,
  allowMultiple = false,
  selectedItems = [],
  mode = 'manage',
  onClose
}: MediaLibraryProps) {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>(selectedItems)
  const [showUploader, setShowUploader] = useState(false)
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null)

  // Fetch media items
  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      setLoading(true)
      // For now, we'll get media from projects. In a real app, you'd have a dedicated media API
      const response = await fetch('/api/projects?includeImages=true')
      if (response.ok) {
        const data = await response.json()
        const allImages: MediaItem[] = []
        
        data.projects?.forEach((project: any) => {
          project.images?.forEach((image: any) => {
            allImages.push({
              id: image.id || `${project.id}-${image.order}`,
              originalUrl: image.originalUrl,
              thumbnailUrl: image.thumbnailUrl,
              alt: image.alt || project.translations?.[0]?.title || 'Project image',
              filename: image.originalUrl.split('/').pop() || 'image',
              size: 0, // Would need to be stored or calculated
              width: 0, // Would need to be stored
              height: 0, // Would need to be stored
              createdAt: project.createdAt
            })
          })
        })
        
        setMedia(allImages)
      }
    } catch (error) {
      console.error('Error fetching media:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredMedia = media.filter(item =>
    item.alt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.filename.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelect = (item: MediaItem) => {
    if (allowMultiple) {
      const isSelected = selectedMedia.some(m => m.id === item.id)
      if (isSelected) {
        const newSelection = selectedMedia.filter(m => m.id !== item.id)
        setSelectedMedia(newSelection)
        onSelectMultiple?.(newSelection)
      } else {
        const newSelection = [...selectedMedia, item]
        setSelectedMedia(newSelection)
        onSelectMultiple?.(newSelection)
      }
    } else {
      onSelect?.(item)
      if (mode === 'select') {
        onClose?.()
      }
    }
  }

  const isSelected = (item: MediaItem) => {
    return selectedMedia.some(m => m.id === item.id)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return 'Unknown size'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="bg-white rounded-lg border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Media Library</h2>
          <div className="flex items-center gap-2">
            {mode === 'select' && onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUploader(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
            
            <div className="flex border border-gray-300 rounded">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Selection info */}
        {allowMultiple && selectedMedia.length > 0 && (
          <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-800">
            {selectedMedia.length} item{selectedMedia.length !== 1 ? 's' : ''} selected
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading media...</div>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Upload className="h-12 w-12 mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No media found</p>
            <p className="text-sm">Upload some images to get started</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setShowUploader(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Images
            </Button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'
              : 'space-y-2'
          }>
            {filteredMedia.map((item) => (
              <div
                key={item.id}
                className={`
                  relative group cursor-pointer border-2 rounded-lg overflow-hidden transition-all
                  ${isSelected(item) 
                    ? 'border-blue-500 ring-2 ring-blue-200' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                  ${viewMode === 'grid' ? 'aspect-square' : 'flex items-center p-3'}
                `}
                onClick={() => handleSelect(item)}
              >
                {viewMode === 'grid' ? (
                  <>
                    <img
                      src={item.thumbnailUrl}
                      alt={item.alt}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Selection indicator */}
                    {isSelected(item) && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation()
                            setPreviewItem(item)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <img
                      src={item.thumbnailUrl}
                      alt={item.alt}
                      className="w-16 h-16 object-cover rounded mr-4"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.filename}</div>
                      <div className="text-xs text-gray-500">{item.alt}</div>
                      <div className="text-xs text-gray-400">{formatFileSize(item.size)}</div>
                    </div>
                    
                    {isSelected(item) && (
                      <Check className="h-5 w-5 text-blue-500" />
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {mode === 'select' && (
        <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {allowMultiple && (
            <Button 
              onClick={() => {
                onSelectMultiple?.(selectedMedia)
                onClose?.()
              }}
              disabled={selectedMedia.length === 0}
            >
              Select {selectedMedia.length} item{selectedMedia.length !== 1 ? 's' : ''}
            </Button>
          )}
        </div>
      )}

      {/* Upload Modal */}
      {showUploader && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Upload Images</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUploader(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <ImageUploader
              onUpload={(files) => {
                console.log('Files uploaded:', files)
                setShowUploader(false)
                fetchMedia() // Refresh the media list
              }}
              multiple
            />
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="max-w-4xl max-h-full p-4">
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{previewItem.filename}</h3>
                  <p className="text-sm text-gray-500">{previewItem.alt}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewItem(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4">
                <img
                  src={previewItem.originalUrl}
                  alt={previewItem.alt}
                  className="max-w-full max-h-96 mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}