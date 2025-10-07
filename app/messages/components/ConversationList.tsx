import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';
import { Conversation, roleColors } from './types';
import { formatTime } from './utils';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: string | null;
  onSelectConversation: (conversationId: string) => void;
}

export default function ConversationList({ 
  conversations, 
  selectedConversation, 
  onSelectConversation 
}: ConversationListProps) {
  return (
    <div className="divide-y">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
            selectedConversation === conversation.id 
              ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500' 
              : ''
          }`}
          onClick={() => onSelectConversation(conversation.id)}
        >
          <div className="flex items-start space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                {conversation.avatar ? (
                  <img 
                    src={conversation.avatar} 
                    alt={conversation.participantName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-gray-500" />
                )}
              </div>
              {conversation.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {conversation.participantName}
                  </h3>
                  <Badge className={roleColors[conversation.participantRole]} variant="secondary">
                    {conversation.participantRole}
                  </Badge>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500">
                    {formatTime(conversation.lastMessageTime)}
                  </span>
                  {conversation.unreadCount > 0 && (
                    <Badge variant="destructive" className="min-w-[20px] h-5 text-xs">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                {conversation.lastMessage}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}