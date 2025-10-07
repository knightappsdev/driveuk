import { Message, Conversation } from './types';

export const mockConversations: Conversation[] = [
  {
    id: '1',
    participantId: 'inst_1',
    participantName: 'Sarah Johnson',
    participantRole: 'instructor',
    lastMessage: 'Great progress in today\'s lesson! Let\'s work on parallel parking next time.',
    lastMessageTime: '2024-01-15T14:30:00Z',
    unreadCount: 1,
    isOnline: true,
    avatar: '/avatars/sarah.jpg'
  },
  {
    id: '2',
    participantId: 'admin_1',
    participantName: 'DriveUK Support',
    participantRole: 'admin',
    lastMessage: 'Your theory test has been scheduled for January 25th at 10:00 AM.',
    lastMessageTime: '2024-01-15T12:45:00Z',
    unreadCount: 0,
    isOnline: false
  },
  {
    id: '3',
    participantId: 'inst_2',
    participantName: 'Mike Thompson',
    participantRole: 'instructor',
    lastMessage: 'Don\'t forget to practice your three-point turns before our next session.',
    lastMessageTime: '2024-01-14T16:20:00Z',
    unreadCount: 0,
    isOnline: true,
    avatar: '/avatars/mike.jpg'
  }
];

export const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      senderId: 'inst_1',
      senderName: 'Sarah Johnson',
      senderRole: 'instructor',
      content: 'Hi John! How are you feeling about your upcoming theory test?',
      timestamp: '2024-01-15T09:00:00Z',
      isRead: true,
      isOwn: false
    },
    {
      id: 'm2',
      senderId: 'current_user',
      senderName: 'John Smith',
      senderRole: 'student',
      content: 'Hi Sarah! I\'m feeling quite confident. I\'ve been practicing with the mock tests you recommended.',
      timestamp: '2024-01-15T09:15:00Z',
      isRead: true,
      isOwn: true
    },
    {
      id: 'm3',
      senderId: 'inst_1',
      senderName: 'Sarah Johnson',
      senderRole: 'instructor',
      content: 'That\'s excellent! Remember to take your time and read each question carefully. You\'ve got this! 🚗',
      timestamp: '2024-01-15T09:20:00Z',
      isRead: true,
      isOwn: false
    },
    {
      id: 'm4',
      senderId: 'current_user',
      senderName: 'John Smith',
      senderRole: 'student',
      content: 'Thank you for the encouragement! What time should we meet for the lesson after my test?',
      timestamp: '2024-01-15T14:20:00Z',
      isRead: true,
      isOwn: true
    },
    {
      id: 'm5',
      senderId: 'inst_1',
      senderName: 'Sarah Johnson',
      senderRole: 'instructor',
      content: 'Great progress in today\'s lesson! Let\'s work on parallel parking next time.',
      timestamp: '2024-01-15T14:30:00Z',
      isRead: false,
      isOwn: false
    }
  ],
  '2': [
    {
      id: 'm6',
      senderId: 'admin_1',
      senderName: 'DriveUK Support',
      senderRole: 'admin',
      content: 'Hello John! We\'ve received your theory test booking request.',
      timestamp: '2024-01-15T10:00:00Z',
      isRead: true,
      isOwn: false
    },
    {
      id: 'm7',
      senderId: 'current_user',
      senderName: 'John Smith',
      senderRole: 'student',
      content: 'Great! When will it be scheduled?',
      timestamp: '2024-01-15T10:05:00Z',
      isRead: true,
      isOwn: true
    },
    {
      id: 'm8',
      senderId: 'admin_1',
      senderName: 'DriveUK Support',
      senderRole: 'admin',
      content: 'Your theory test has been scheduled for January 25th at 10:00 AM.',
      timestamp: '2024-01-15T12:45:00Z',
      isRead: true,
      isOwn: false
    }
  ],
  '3': [
    {
      id: 'm9',
      senderId: 'inst_2',
      senderName: 'Mike Thompson',
      senderRole: 'instructor',
      content: 'Hey John! How did the lesson go today?',
      timestamp: '2024-01-14T16:00:00Z',
      isRead: true,
      isOwn: false
    },
    {
      id: 'm10',
      senderId: 'current_user',
      senderName: 'John Smith',
      senderRole: 'student',
      content: 'It went well! I\'m getting better at parking.',
      timestamp: '2024-01-14T16:10:00Z',
      isRead: true,
      isOwn: true
    },
    {
      id: 'm11',
      senderId: 'inst_2',
      senderName: 'Mike Thompson',
      senderRole: 'instructor',
      content: 'Don\'t forget to practice your three-point turns before our next session.',
      timestamp: '2024-01-14T16:20:00Z',
      isRead: true,
      isOwn: false
    }
  ]
};

export const formatTime = (timestamp: string): string => {
  const now = new Date();
  const messageTime = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - messageTime.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'now';
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
  return `${Math.floor(diffInMinutes / 1440)}d`;
};

export const filterConversations = (conversations: Conversation[], searchQuery: string): Conversation[] => {
  if (!searchQuery.trim()) return conversations;
  
  return conversations.filter(conversation =>
    conversation.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );
};