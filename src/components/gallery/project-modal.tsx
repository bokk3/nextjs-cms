'use client'

import { ProjectWithRelations } from '@/types/project'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface ProjectModalProps {
  project: ProjectWithRelations | null
  isOpen: boolean
  onClose: () => void
  languageId?: string
}

export function ProjectModal({ project, isOpen, onClose, languageId = 'nl' }: ProjectModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Reset image index when project changes
  useEffect(() => {
    setCurrentImageIndex(0)
  }, [project])

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        previousImage()
      } else if (e.key === 'ArrowRight') {
        nextImage()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !project) return null

  const translation = project.translations.find(t => t.language.code === languageId) 
    || project.translations[0]

  if (!translation) return null

  const images = project.images
  const currentImage = images[currentImageIndex]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  // Parse TipTap JSON content to plain text for display
  const getDescriptionText = (description: any): string => {
    if (typeof description === 'string') return description
    if (!description || !description.content) return ''
    
    const extractText = (node: any): string => {
      if (node.type === 'text') return node.text || ''
      if (node.content) {
        return node.content.map(extractText).join('')
      }
      return ''
    }
    
    return description.content.map(extractText).join('\n')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-75 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] w-full mx-4 overflow-hidden">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 bg-white bg-opacity-90 hover:bg-opacity-100"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="flex flex-col lg:flex-row">
          {/* Image Section */}
          <div className="lg:w-2/3 relative">
            {currentImage && (
              <div className="relative aspect-square lg:aspect-4/3 bg-gray-100">
                <Image
                  src={currentImage.originalUrl}
                  alt={currentImage.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                />
                
                {/* Image Navigation */}
                {images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100"
                      onClick={previousImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>
            )}
            
            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    className={`relative shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex 
                        ? 'border-black' 
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <Image
                      src={image.thumbnailUrl}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="lg:w-1/3 p-6 overflow-y-auto max-h-[50vh] lg:max-h-[90vh]">
            <div className="space-y-4">
              {/* Featured Badge */}
              {project.featured && (
                <div className="inline-block bg-black text-white text-xs px-2 py-1 rounded">
                  Featured Project
                </div>
              )}
              
              {/* Title */}
              <h2 className="text-2xl font-bold text-black">
                {translation.title}
              </h2>
              
              {/* Materials */}
              {translation.materials.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Materials</h3>
                  <div className="flex flex-wrap gap-2">
                    {translation.materials.map((material, index) => (
                      <span 
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm"
                      >
                        {material}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Description */}
              {translation.description && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <div className="text-gray-700 whitespace-pre-line">
                    {getDescriptionText(translation.description)}
                  </div>
                </div>
              )}
              
              {/* Project Info */}
              <div className="pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <p>Content Type: {project.contentType.displayName}</p>
                  <p>Created: {new Date(project.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}