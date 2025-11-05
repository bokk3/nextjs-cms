import { ContentManagement } from '@/components/admin/content-management'
import { Breadcrumb } from '@/components/admin/breadcrumb'

export default function AdminContentPage() {
  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: 'Content Management' }]} />
      <ContentManagement />
    </div>
  )
}