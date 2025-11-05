'use client'

import { ProjectWithRelations } from '@/types/project'
import Image from 'next/image'
import { useState } from 'react'

interface ProjectCardProps {
  project: ProjectWithRelations
  onClick: () => void
  languageId?: string
}

export function ProjectCard({ project, onClick, languageId = 'nl' }: ProjectCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  
  // Get translation for the specified language or fallback to first available
  const translation = project.translations.find(t => t.language.code === languageId) 
    || project.translations[0]
  
  // Get the first image as the card thumbnail
  const thumbnailImage = project.images[0]
  
  if (!translation || !thumbnailImage) {
    return null
  }

  return (
    <div 
      className="group cursor-pointer bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={thumbnailImage.thumbnailUrl}
          alt={thumbnailImage.alt}
          fill
          className={`object-cover transition-all duration-300 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
        
        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-3 right-3 bg-black text-white text-xs px-2 py-1 rounded">
            Featured
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg text-black mb-2 line-clamp-2">
          {translation.title}
        </h3>
        
        {/* Materials */}
        {translation.materials.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {translation.materials.slice(0, 3).map((material, index) => (
              <span 
                key={index}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
              >
                {material}
              </span>
            ))}
            {translation.materials.length > 3 && (
              <span className="text-xs text-gray-500">
                +{translation.materials.length - 3} more
              </span>
            )}
          </div>
        )}
        
        {/* View details indicator */}
        <div className="text-sm text-gray-600 group-hover:text-black transition-colors">
          View details →
        </div>
      </div>
    </div>
  )
}