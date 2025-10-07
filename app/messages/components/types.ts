export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'student' | 'instructor' | 'admin';
  content: string;
  timestamp: string;
  isRead: boolean;
  isOwn: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: 'student' | 'instructor' | 'admin';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  avatar?: string;
}

export const roleColors = {
  student: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  instructor: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
};

export const roleLabels = {
  student: 'Student',
  instructor: 'Instructor',
  admin: 'Admin',
};