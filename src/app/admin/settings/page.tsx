import { EmailSettings } from '@/components/admin/email-settings';
import { Breadcrumb } from '@/components/admin/breadcrumb';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb 
        items={[
          { label: 'Admin', href: '/admin' },
          { label: 'Settings', href: '/admin/settings' }
        ]} 
      />
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your system configuration and preferences.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Email Configuration
          </h2>
          <EmailSettings />
        </section>
      </div>
    </div>
  );
}