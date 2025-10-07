import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Video, MoreVertical, User } from 'lucide-react';
import { Conversation, roleColors } from './types';

interface MessageHeaderProps {
  conversation: Conversation;
}

export default function MessageHeader({ conversation }: MessageHeaderProps) {
  return (
    <CardHeader className="border-b flex-row items-center justify-between py-4">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
            {conversation.avatar ? (
              <img 
                src={conversation.avatar} 
                alt={conversation.participantName}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-gray-500" />
            )}
          </div>
          {conversation.isOnline && (
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white dark:border-gray-800"></div>
          )}
        </div>
        <div>
          <CardTitle className="text-lg">{conversation.participantName}</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className={roleColors[conversation.participantRole]} variant="secondary">
              {conversation.participantRole}
            </Badge>
            <span className="text-xs text-gray-500">
              {conversation.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm">
          <Phone className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Video className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>
    </CardHeader>
  );
}