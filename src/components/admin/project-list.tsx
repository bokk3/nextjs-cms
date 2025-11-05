'use client'

import { useState, useEffect } from 'react'
import { ProjectWithRelations } from '@/types/project'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

interface ProjectListProps {
  onCreateProject: () => void
  onEditProject: (project: ProjectWithRelations) => void
  onDeleteProject: (project: ProjectWithRelations) => void
}

export function ProjectList({ onCreateProject, onEditProject, onDeleteProject }: ProjectListProps) {
  const [projects, setProjects] = useState<ProjectWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [publishedFilter, setPublishedFilter] = useState<string>('all')
  const [featuredFilter, setFeaturedFilter] = useState<string>('all')

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (search) params.append('search', search)
      if (publishedFilter !== 'all') params.append('published', publishedFilter)
      if (featuredFilter !== 'all') params.append('featured', featuredFilter)
      params.append('limit', '50') // Get more projects for admin view

      const response = await fetch(`/api/projects?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }

      const data = await response.json()
      setProjects(data.projects)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [search, publishedFilter, featuredFilter])

  const handleToggleFeatured = async (project: ProjectWithRelations) => {
    try {
      const response = await fetch(`/api/projects/${project.id}/toggle-featured`, {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Failed to toggle featured status')
      }

      // Refresh the list
      fetchProjects()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleTogglePublished = async (project: ProjectWithRelations) => {
    try {
      const response = await fetch(`/api/projects/${project.id}/toggle-published`, {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Failed to toggle published status')
      }

      // Refresh the list
      fetchProjects()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const getProjectTitle = (project: ProjectWithRelations) => {
    // Get title from first available translation
    const translation = project.translations[0]
    return translation?.title || 'Untitled Project'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading projects...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <div className="text-red-800">Error: {error}</div>
        <Button 
          onClick={fetchProjects} 
          variant="outline" 
          size="sm" 
          className="mt-2"
        >
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button onClick={onCreateProject}>
          Create Project
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select
          value={publishedFilter}
          onChange={(e) => setPublishedFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="true">Published</option>
          <option value="false">Draft</option>
        </Select>
        <Select
          value={featuredFilter}
          onChange={(e) => setFeaturedFilter(e.target.value)}
        >
          <option value="all">All Projects</option>
          <option value="true">Featured</option>
          <option value="false">Not Featured</option>
        </Select>
      </div>

      {/* Projects Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Images
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No projects found. Create your first project to get started.
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {getProjectTitle(project)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {project.translations.length} translation(s)
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        project.published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.published ? 'Published' : 'Draft'}
                      </span>
                      {project.featured && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {project.images.length} image(s)
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                    <Button
                      onClick={() => onEditProject(project)}
                      variant="outline"
                      size="sm"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleToggleFeatured(project)}
                      variant="outline"
                      size="sm"
                    >
                      {project.featured ? 'Unfeature' : 'Feature'}
                    </Button>
                    <Button
                      onClick={() => handleTogglePublished(project)}
                      variant="outline"
                      size="sm"
                    >
                      {project.published ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button
                      onClick={() => onDeleteProject(project)}
                      variant="destructive"
                      size="sm"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}