'use client';

import RealTimeChat from '@/components/driving-school/chat/real-time-chat';

export default function MessagesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-lg text-gray-600">
          Real-time messaging with your students
        </p>
      </div>

      <RealTimeChat />
    </div>
  );
}