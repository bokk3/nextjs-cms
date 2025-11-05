'use client'

import { ProjectWithRelations } from '@/types/project'
import { ProjectGrid } from '@/components/gallery/project-grid'
import { ProjectModal } from '@/components/gallery/project-modal'
import { useState } from 'react'

interface ProjectGalleryClientProps {
  projects: ProjectWithRelations[]
}

export function ProjectGalleryClient({ projects }: ProjectGalleryClientProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectWithRelations | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleProjectClick = (project: ProjectWithRelations) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
  }

  return (
    <>
      <ProjectGrid
        projects={projects}
        onProjectClick={handleProjectClick}
        languageId="nl" // TODO: Get from user preferences/context
      />
      
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        languageId="nl" // TODO: Get from user preferences/context
      />
    </>
  )
}