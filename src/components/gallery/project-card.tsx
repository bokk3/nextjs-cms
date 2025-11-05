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
  
  if (!translation) {
    return null
  }

  return (
    <div 
      className="group cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg dark:hover:shadow-gray-900/20 transition-all duration-300 hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden">
        {thumbnailImage ? (
          <>
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
          </>
        ) : (
          // Placeholder for projects without images
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">No Image</p>
            </div>
          </div>
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
        <h3 className="font-semibold text-lg text-black dark:text-white mb-2 line-clamp-2">
          {translation.title}
        </h3>
        
        {/* Materials */}
        {translation.materials.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {translation.materials.slice(0, 3).map((material, index) => (
              <span 
                key={index}
                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
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
        <div className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">
          View details →
        </div>
      </div>
    </div>
  )
}