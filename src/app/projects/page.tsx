import { ProjectService } from '@/lib/project-service'
import { ProjectGalleryClient } from './project-gallery-client'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects | Portfolio',
  description: 'Browse our collection of custom projects and artisan work.',
  openGraph: {
    title: 'Projects | Portfolio',
    description: 'Browse our collection of custom projects and artisan work.',
    type: 'website',
  },
}

export default async function ProjectsPage() {
  // Fetch published projects
  const projects = await ProjectService.getPublishedProjects()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-black mb-4">
              Our Projects
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our collection of custom work and artisan projects. 
              Each piece is crafted with attention to detail and quality materials.
            </p>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProjectGalleryClient projects={projects} />
      </div>
    </div>
  )
}