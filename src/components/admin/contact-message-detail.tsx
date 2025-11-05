"use client";

import { ContactMessage } from '../../types/contact';
import { contactMessageService } from '../../lib/contact-service';
import { Button } from '../ui/button';
import { useState } from 'react';

interface ContactMessageDetailProps {
  message: ContactMessage;
  onClose: () => void;
  onUpdate: () => void;
}

export function ContactMessageDetail({ message, onClose, onUpdate }: ContactMessageDetailProps) {
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (field: 'read' | 'replied', value: boolean) => {
    try {
      setLoading(true);
      await contactMessageService.updateMessage(message.id, { [field]: value });
      onUpdate();
    } catch (error) {
      console.error('Failed to update message:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEmailClick = () => {
    const subject = encodeURIComponent(`Re: ${message.projectType} Inquiry`);
    const body = encodeURIComponent(`Hi ${message.name},\n\nThank you for your message about ${message.projectType}.\n\n`);
    window.open(`mailto:${message.email}?subject=${subject}&body=${body}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Contact Message Details</h2>
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
            >
              ✕
            </Button>
          </div>

          {/* Status Badges */}
          <div className="flex space-x-2 mb-6">
            <span
              className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                message.read
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {message.read ? 'Read' : 'Unread'}
            </span>
            {message.replied && (
              <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                Replied
              </span>
            )}
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <p className="text-sm text-gray-900">{message.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-sm text-gray-900">
                  <button
                    onClick={handleEmailClick}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {message.email}
                  </button>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Type
                </label>
                <p className="text-sm text-gray-900">{message.projectType}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Received
                </label>
                <p className="text-sm text-gray-900">{formatDate(message.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Message</h3>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-gray-900 whitespace-pre-wrap">{message.message}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => handleStatusChange('read', !message.read)}
              disabled={loading}
              variant="outline"
            >
              {message.read ? 'Mark as Unread' : 'Mark as Read'}
            </Button>
            <Button
              onClick={() => handleStatusChange('replied', !message.replied)}
              disabled={loading}
              variant="outline"
            >
              {message.replied ? 'Mark as Not Replied' : 'Mark as Replied'}
            </Button>
            <Button
              onClick={handleEmailClick}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Reply via Email
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}