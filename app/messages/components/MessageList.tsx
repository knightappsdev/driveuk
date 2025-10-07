import { Badge } from '@/components/ui/badge';
import { Star, Clock, Check, CheckCheck, User } from 'lucide-react';
import { Message, roleColors } from './types';
import { formatTime } from './utils';

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div key={message.id} className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-xs lg:max-w-md ${message.isOwn ? 'order-2' : 'order-1'}`}>
            <div className={`rounded-lg p-3 ${
              message.isOwn 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
            }`}>
              {!message.isOwn && (
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                    <User className="w-4 h-4 text-gray-500" />
                  </div>
                  <span className="text-xs font-medium">{message.senderName}</span>
                  <Badge className={roleColors[message.senderRole]} variant="secondary">
                    {message.senderRole}
                  </Badge>
                </div>
              )}
              <p className="text-sm">{message.content}</p>
              <div className={`flex items-center justify-between mt-2 text-xs ${
                message.isOwn ? 'text-blue-100' : 'text-gray-500'
              }`}>
                <span>{formatTime(message.timestamp)}</span>
                {message.isOwn && (
                  <div className="flex items-center space-x-1">
                    {message.isRead ? (
                      <CheckCheck className="w-3 h-3" />
                    ) : (
                      <Check className="w-3 h-3" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}