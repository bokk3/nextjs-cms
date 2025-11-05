import { Metadata } from 'next'
import { GalleryManagement } from '@/components/admin/gallery-management'

export const metadata: Metadata = {
  title: 'Gallery Management - Admin',
  description: 'Manage media library and image gallery'
}

export default function GalleryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
        <p className="text-gray-600">
          Manage your media library, organize images, and configure optimization settings.
        </p>
      </div>

      <GalleryManagement />
    </div>
  )
}