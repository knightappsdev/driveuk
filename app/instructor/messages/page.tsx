'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  Search,
  User,
  Phone,
  Video,
  MoreVertical,
  Star,
  Clock,
  Check,
  CheckCheck,
  Users,
  Calendar
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'student' | 'instructor' | 'admin';
  content: string;
  timestamp: string;
  isRead: boolean;
  isOwn: boolean;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: 'student' | 'instructor' | 'admin';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  studentInfo?: {
    lessonsCompleted: number;
    nextLesson?: string;
    progress: number;
  };
}

export default function InstructorMessages() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1');
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - in real app this would come from API
  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      participantId: 'student_1',
      participantName: 'John Smith',
      participantRole: 'student',
      lastMessage: 'Thank you for the lesson today! When is our next session?',
      lastMessageTime: '2024-01-15T16:30:00Z',
      unreadCount: 1,
      isOnline: true,
      studentInfo: {
        lessonsCompleted: 12,
        nextLesson: '2024-01-17T10:00:00Z',
        progress: 75
      }
    },
    {
      id: '2',
      participantId: 'student_2',
      participantName: 'Emma Wilson',
      participantRole: 'student',
      lastMessage: 'I\'m nervous about parallel parking. Can we practice more?',
      lastMessageTime: '2024-01-15T14:15:00Z',
      unreadCount: 2,
      isOnline: false,
      studentInfo: {
        lessonsCompleted: 8,
        nextLesson: '2024-01-16T14:00:00Z',
        progress: 55
      }
    },
    {
      id: '3',
      participantId: 'admin_1',
      participantName: 'DriveUK Admin',
      participantRole: 'admin',
      lastMessage: 'Please confirm your availability for next week\'s schedule.',
      lastMessageTime: '2024-01-15T11:00:00Z',
      unreadCount: 0,
      isOnline: false
    },
    {
      id: '4',
      participantId: 'student_3',
      participantName: 'Michael Brown',
      participantRole: 'student',
      lastMessage: 'Great lesson today! I feel much more confident now.',
      lastMessageTime: '2024-01-14T17:45:00Z',
      unreadCount: 0,
      isOnline: true,
      studentInfo: {
        lessonsCompleted: 20,
        nextLesson: '2024-01-18T09:00:00Z',
        progress: 90
      }
    }
  ]);

  const [messages] = useState<Record<string, Message[]>>({
    '1': [
      {
        id: 'm1',
        senderId: 'current_instructor',
        senderName: 'Sarah Johnson',
        senderRole: 'instructor',
        content: 'Hi John! Great work in today\'s lesson. Your confidence is really building up.',
        timestamp: '2024-01-15T15:00:00Z',
        isRead: true,
        isOwn: true
      },
      {
        id: 'm2',
        senderId: 'student_1',
        senderName: 'John Smith',
        senderRole: 'student',
        content: 'Thank you Sarah! I really felt the difference today, especially during the roundabouts.',
        timestamp: '2024-01-15T15:15:00Z',
        isRead: true,
        isOwn: false
      },
      {
        id: 'm3',
        senderId: 'current_instructor',
        senderName: 'Sarah Johnson',
        senderRole: 'instructor',
        content: 'Exactly! Your positioning and timing have improved significantly. Next lesson we\'ll focus on dual carriageway driving.',
        timestamp: '2024-01-15T15:20:00Z',
        isRead: true,
        isOwn: true
      },
      {
        id: 'm4',
        senderId: 'student_1',
        senderName: 'John Smith',
        senderRole: 'student',
        content: 'Thank you for the lesson today! When is our next session?',
        timestamp: '2024-01-15T16:30:00Z',
        isRead: false,
        isOwn: false
      }
    ],
    '2': [
      {
        id: 'm5',
        senderId: 'student_2',
        senderName: 'Emma Wilson',
        senderRole: 'student',
        content: 'Hi Sarah, I\'ve been practicing the theory questions you recommended.',
        timestamp: '2024-01-15T13:00:00Z',
        isRead: true,
        isOwn: false
      },
      {
        id: 'm6',
        senderId: 'current_instructor',
        senderName: 'Sarah Johnson',
        senderRole: 'instructor',
        content: 'That\'s excellent Emma! How are you finding the hazard perception section?',
        timestamp: '2024-01-15T13:30:00Z',
        isRead: true,
        isOwn: true
      },
      {
        id: 'm7',
        senderId: 'student_2',
        senderName: 'Emma Wilson',
        senderRole: 'student',
        content: 'I\'m nervous about parallel parking. Can we practice more?',
        timestamp: '2024-01-15T14:15:00Z',
        isRead: false,
        isOwn: false
      }
    ]
  });

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConversationData = conversations.find(conv => conv.id === selectedConversation);
  const conversationMessages = selectedConversation ? messages[selectedConversation] || [] : [];

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    // TODO: Send message to API
    console.log('Sending message:', newMessage, 'to conversation:', selectedConversation);
    setNewMessage('');
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student': return 'bg-green-100 text-green-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-lg text-gray-600">Communicate with your students and admin team</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
          {/* Conversations List */}
          <Card className="bg-white shadow-lg lg:col-span-1">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
                  Conversations
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {conversations.filter(c => c.unreadCount > 0).length} unread
                </Badge>
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[calc(100vh-20rem)] overflow-y-auto">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-600" />
                        </div>
                        {conversation.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {conversation.participantName}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatTime(conversation.lastMessageTime)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <Badge variant="secondary" className={`text-xs ${getRoleColor(conversation.participantRole)}`}>
                            {conversation.participantRole}
                          </Badge>
                          {conversation.unreadCount > 0 && (
                            <Badge className="bg-red-500 text-white text-xs">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>

                        {/* Student Progress Info */}
                        {conversation.studentInfo && (
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center justify-between text-xs text-gray-600">
                              <span>Progress: {conversation.studentInfo.progress}%</span>
                              <span>{conversation.studentInfo.lessonsCompleted} lessons</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1">
                              <div 
                                className={`h-1 rounded-full ${getProgressColor(conversation.studentInfo.progress)}`}
                                style={{ width: `${conversation.studentInfo.progress}%` }}
                              ></div>
                            </div>
                            {conversation.studentInfo.nextLesson && (
                              <div className="flex items-center text-xs text-gray-600 mt-1">
                                <Calendar className="w-3 h-3 mr-1" />
                                Next: {formatTime(conversation.studentInfo.nextLesson)}
                              </div>
                            )}
                          </div>
                        )}

                        <p className="text-sm text-gray-600 truncate mt-2">
                          {conversation.lastMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="bg-white shadow-lg lg:col-span-2">
            {selectedConversationData ? (
              <>
                {/* Chat Header */}
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      {selectedConversationData.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {selectedConversationData.participantName}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className={`text-xs ${getRoleColor(selectedConversationData.participantRole)}`}>
                          {selectedConversationData.participantRole}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {selectedConversationData.isOnline ? 'Online' : 'Offline'}
                        </span>
                        {selectedConversationData.studentInfo && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span className="text-sm text-gray-500">
                              {selectedConversationData.studentInfo.lessonsCompleted} lessons
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="text-sm text-gray-500">
                              {selectedConversationData.studentInfo.progress}% progress
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>

                {/* Student Quick Info (for student conversations) */}
                {selectedConversationData.studentInfo && (
                  <div className="px-4 py-3 bg-gray-50 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Next Lesson:</span>
                          <span className="text-sm text-gray-900 ml-1">
                            {selectedConversationData.studentInfo.nextLesson 
                              ? new Date(selectedConversationData.studentInfo.nextLesson).toLocaleDateString('en-US', { 
                                  weekday: 'short', 
                                  month: 'short', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : 'Not scheduled'
                            }
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        Schedule Lesson
                      </Button>
                    </div>
                  </div>
                )}

                {/* Messages */}
                <CardContent className="flex-1 p-0">
                  <div className="h-[calc(100vh-28rem)] overflow-y-auto p-4 space-y-4">
                    {conversationMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isOwn 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          {!message.isOwn && (
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge variant="secondary" className={`text-xs ${getRoleColor(message.senderRole)}`}>
                                {message.senderRole}
                              </Badge>
                            </div>
                          )}
                          <p className="text-sm">{message.content}</p>
                          <div className={`flex items-center justify-between mt-1 text-xs ${
                            message.isOwn ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            <span>{formatTime(message.timestamp)}</span>
                            {message.isOwn && (
                              <div className="ml-2">
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
                    ))}
                  </div>

                  {/* Quick Responses (for instructor) */}
                  <div className="px-4 py-2 border-t bg-gray-50">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setNewMessage("Great progress in today's lesson!")}
                        className="text-xs"
                      >
                        Great progress! 👍
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setNewMessage("Let's schedule your next lesson.")}
                        className="text-xs"
                      >
                        Schedule next lesson 📅
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setNewMessage("Please practice the theory questions I shared.")}
                        className="text-xs"
                      >
                        Practice theory 📚
                      </Button>
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-600">
                    Choose a student or admin conversation to start messaging
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}