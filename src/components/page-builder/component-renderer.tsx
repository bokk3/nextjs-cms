'use client'

import { PageComponent } from '@/types/page-builder'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Award, 
  Users, 
  Clock, 
  Star, 
  ArrowRight, 
  CheckCircle, 
  Heart,
  Shield,
  Zap,
  Target,
  Lightbulb,
  Palette
} from 'lucide-react'
import { ProjectCard } from '@/components/gallery/project-card'
import { useState, useEffect } from 'react'

interface ComponentRendererProps {
  component: PageComponent
  isPreview?: boolean
  currentLanguage?: string
}

export function ComponentRenderer({ 
  component, 
  isPreview = false, 
  currentLanguage = 'nl' 
}: ComponentRendererProps) {
  const { type, data } = component

  const containerStyle = {
    backgroundColor: data.backgroundColor || '#ffffff',
    color: data.textColor || '#000000',
    padding: data.padding ? 
      `${data.padding.top}px ${data.padding.right}px ${data.padding.bottom}px ${data.padding.left}px` : 
      undefined
  }

  // Helper function to get multilingual text
  const getText = (text: string | { [key: string]: string } | undefined): string => {
    if (!text) return ''
    if (typeof text === 'string') return text
    return text[currentLanguage] || text['nl'] || Object.values(text)[0] || ''
  }

  switch (type) {
    case 'hero':
      const gradientClass = data.backgroundType === 'gradient' && data.gradient 
        ? `bg-gradient-to-br ${data.gradient}` 
        : ''
      
      return (
        <div 
          className={`relative ${data.height === 'screen' ? 'min-h-screen' : 'py-20'} px-4 sm:px-6 lg:px-8 flex items-center justify-center ${gradientClass} dark:from-gray-900 dark:via-gray-800 dark:to-gray-900`}
          style={data.backgroundType !== 'gradient' ? containerStyle : { color: data.textColor }}
        >
          {data.backgroundImage && (
            <div className="absolute inset-0">
              <Image
                src={data.backgroundImage}
                alt=""
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40" />
            </div>
          )}
          
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            {data.title && (
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                {getText(data.title)}
              </h1>
            )}
            
            {data.subtitle && (
              <p className="text-xl sm:text-2xl lg:text-3xl mb-6 opacity-90 font-light">
                {getText(data.subtitle)}
              </p>
            )}
            
            {data.description && (
              <p className="text-lg sm:text-xl mb-10 opacity-80 max-w-3xl mx-auto leading-relaxed">
                {getText(data.description)}
              </p>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {data.primaryButton && (
                <Link href="/projects">
                  <Button 
                    size="lg"
                    className="w-full sm:w-auto text-lg px-8 py-4 h-auto bg-white text-slate-900 hover:bg-gray-100 border-0"
                  >
                    {getText(data.primaryButton)}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              )}
              
              {data.secondaryButton && (
                <Link href="/contact">
                  <Button 
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto text-lg px-8 py-4 h-auto border-2 border-white text-white hover:bg-white hover:text-slate-900"
                  >
                    {getText(data.secondaryButton)}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )

    case 'features':
      const getIcon = (iconName: string) => {
        const icons = {
          award: Award,
          users: Users,
          clock: Clock,
          star: Star,
          check: CheckCircle,
          heart: Heart,
          shield: Shield,
          zap: Zap,
          target: Target,
          lightbulb: Lightbulb,
          palette: Palette
        }
        const IconComponent = icons[iconName as keyof typeof icons] || Award
        return <IconComponent className="w-12 h-12" />
      }

      return (
        <div 
          className={`py-20 px-4 sm:px-6 lg:px-8 ${data.backgroundColor === 'white' ? 'bg-white dark:bg-gray-900' : data.backgroundColor === 'gray-50' ? 'bg-gray-50 dark:bg-gray-800' : ''}`}
          style={data.backgroundColor !== 'white' && data.backgroundColor !== 'gray-50' ? containerStyle : { color: data.textColor }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              {data.title && (
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                  {getText(data.title)}
                </h2>
              )}
              {data.subtitle && (
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  {getText(data.subtitle)}
                </p>
              )}
            </div>
            
            {data.features && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {data.features.map((feature: any, index: number) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-6">
                      <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-400">
                        {getIcon(feature.icon)}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                      {getText(feature.title)}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {getText(feature.description)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )

    case 'text':
      return (
        <div 
          className="py-8 px-8"
          style={containerStyle}
        >
          <div className={`max-w-4xl mx-auto prose prose-lg ${
            data.alignment === 'center' ? 'text-center' : 
            data.alignment === 'right' ? 'text-right' : 'text-left'
          }`}>
            <div 
              dangerouslySetInnerHTML={{ __html: getText(data.content) }}
              style={{ color: data.textColor }}
            />
          </div>
        </div>
      )

    case 'image':
      return (
        <div 
          className="py-8 px-8"
          style={containerStyle}
        >
          <div className="max-w-4xl mx-auto text-center">
            {data.imageUrl ? (
              <div className="relative inline-block">
                <Image
                  src={data.imageUrl}
                  alt={getText(data.alt) || ''}
                  width={800}
                  height={600}
                  className="rounded-lg shadow-lg"
                />
                {data.caption && (
                  <p className="mt-4 text-sm text-gray-600 italic">
                    {getText(data.caption)}
                  </p>
                )}
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Select an image</p>
              </div>
            )}
          </div>
        </div>
      )

    case 'gallery':
      const [featuredProjects, setFeaturedProjects] = useState([])
      
      useEffect(() => {
        if (data.showFeatured) {
          fetch('/api/projects?featured=true')
            .then(res => res.json())
            .then(data => setFeaturedProjects(data.projects || []))
            .catch(err => console.error('Error fetching featured projects:', err))
        }
      }, [data.showFeatured])

      return (
        <div 
          className={`py-20 px-4 sm:px-6 lg:px-8 ${
            data.backgroundColor === 'gray-50' ? 'bg-gray-50 dark:bg-gray-800' : 
            data.backgroundColor === 'white' ? 'bg-white dark:bg-gray-900' : ''
          }`}
          style={data.backgroundColor !== 'white' && data.backgroundColor !== 'gray-50' ? containerStyle : { color: data.textColor }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              {data.title && (
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                  {getText(data.title)}
                </h2>
              )}
              {data.subtitle && (
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  {getText(data.subtitle)}
                </p>
              )}
            </div>
            
            {data.showFeatured && featuredProjects.length > 0 ? (
              <>
                <div className={`grid grid-cols-1 sm:grid-cols-2 ${
                  data.columns === 4 ? 'lg:grid-cols-4' : 
                  data.columns === 3 ? 'lg:grid-cols-3' : 
                  data.columns === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'
                } gap-8`}>
                  {featuredProjects.slice(0, data.maxItems || 8).map((project: any) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onClick={() => {}}
                      languageId={currentLanguage}
                    />
                  ))}
                </div>
                
                {featuredProjects.length > (data.maxItems || 8) && (
                  <div className="text-center mt-12">
                    <Link href="/projects">
                      <Button variant="outline" size="lg">
                        View All Projects
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            ) : data.images && data.images.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {data.images.map((image: any, index: number) => (
                  <div key={image.id || index} className="relative aspect-square">
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No projects to display</p>
              </div>
            )}
          </div>
        </div>
      )

    case 'testimonials':
      return (
        <div 
          className={`py-20 px-4 sm:px-6 lg:px-8 ${
            data.backgroundColor === 'white' ? 'bg-white dark:bg-gray-900' : 
            data.backgroundColor === 'gray-50' ? 'bg-gray-50 dark:bg-gray-800' : ''
          }`}
          style={data.backgroundColor !== 'white' && data.backgroundColor !== 'gray-50' ? containerStyle : { color: data.textColor }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              {data.title && (
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                  {getText(data.title)}
                </h2>
              )}
            </div>
            
            {data.testimonials && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {data.testimonials.map((testimonial: any, index: number) => (
                  <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-gray-700 dark:text-gray-300 mb-6 italic">
                      "{getText(testimonial.content)}"
                    </blockquote>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">{getText(testimonial.role)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )

    case 'cta':
      return (
        <div 
          className={`py-20 px-4 sm:px-6 lg:px-8 text-center ${data.backgroundColor === 'slate-900' ? 'bg-slate-900' : ''}`}
          style={data.backgroundColor !== 'slate-900' ? containerStyle : { color: data.textColor }}
        >
          <div className="max-w-4xl mx-auto">
            {(data.title || data.heading) && (
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                {getText(data.title || data.heading)}
              </h2>
            )}
            
            {data.description && (
              <p className="text-xl mb-10 opacity-90 leading-relaxed">
                {getText(data.description)}
              </p>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {(data.primaryButton || data.ctaButtonText) && (
                <Link href="/contact">
                  <Button 
                    size="lg"
                    className="w-full sm:w-auto text-lg px-8 py-4 h-auto bg-white text-slate-900 hover:bg-gray-100"
                  >
                    {getText(data.primaryButton || data.ctaButtonText)}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              )}
              
              {data.secondaryButton && (
                <Link href="/projects">
                  <Button 
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto text-lg px-8 py-4 h-auto border-2 border-white text-white hover:bg-white hover:text-slate-900"
                  >
                    {getText(data.secondaryButton)}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )

    case 'spacer':
      return (
        <div 
          style={{
            height: `${data.height || 60}px`,
            backgroundColor: data.backgroundColor || 'transparent'
          }}
        />
      )

    default:
      return (
        <div className="py-8 px-8 text-center text-gray-500">
          Unknown component type: {type}
        </div>
      )
  }
}