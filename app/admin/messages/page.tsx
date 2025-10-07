'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  Plus,
  Search,
  Send,
  Users,
  UserCheck,
  GraduationCap,
  Filter,
  MoreHorizontal,
  Reply,
  Archive,
  Trash2,
  Star,
  Clock,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Message {
  id: string;
  subject: string;
  content: string;
  sender: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'instructor' | 'student';
    avatar?: string;
  };
  recipient: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'instructor' | 'student';
  };
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  priority: 'low' | 'normal' | 'high';
  thread?: Message[];
}

interface NewMessageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendMessage: (messageData: {
    subject: string;
    content: string;
    recipient: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
    priority: 'low' | 'normal' | 'high';
  }) => void;
  recipient?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

// Mock data for demonstration
const mockMessages: Message[] = [
  {
    id: '1',
    subject: 'Lesson Scheduling Request',
    content: 'Hi, I would like to schedule additional practice sessions for the upcoming theory test. Could you please help me arrange this?',
    sender: {
      id: 'student_1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      role: 'student',
    },
    recipient: {
      id: 'admin_1',
      name: 'Admin',
      email: 'admin@driveuk.com',
      role: 'admin',
    },
    timestamp: '2025-01-15T10:30:00Z',
    isRead: false,
    isStarred: true,
    isArchived: false,
    priority: 'high',
  },
  {
    id: '2',
    subject: 'Student Progress Update',
    content: 'The student has completed 15 lessons and is ready for the practical test. Please schedule the test booking.',
    sender: {
      id: 'instructor_1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@driveuk.com',
      role: 'instructor',
    },
    recipient: {
      id: 'admin_1',
      name: 'Admin',
      email: 'admin@driveuk.com',
      role: 'admin',
    },
    timestamp: '2025-01-15T09:15:00Z',
    isRead: true,
    isStarred: false,
    isArchived: false,
    priority: 'normal',
  },
  {
    id: '3',
    subject: 'Payment Issue',
    content: 'There seems to be an issue with the payment processing for lesson package. The transaction failed multiple times.',
    sender: {
      id: 'student_2',
      name: 'Emma Wilson',
      email: 'emma.wilson@email.com',
      role: 'student',
    },
    recipient: {
      id: 'admin_1',
      name: 'Admin',
      email: 'admin@driveuk.com',
      role: 'admin',
    },
    timestamp: '2025-01-14T16:45:00Z',
    isRead: true,
    isStarred: false,
    isArchived: false,
    priority: 'high',
  },
];

const mockUsers = [
  { id: 'instructor_1', name: 'Sarah Johnson', email: 'sarah.johnson@driveuk.com', role: 'instructor' },
  { id: 'instructor_2', name: 'Mike Thompson', email: 'mike.thompson@driveuk.com', role: 'instructor' },
  { id: 'student_1', name: 'John Smith', email: 'john.smith@email.com', role: 'student' },
  { id: 'student_2', name: 'Emma Wilson', email: 'emma.wilson@email.com', role: 'student' },
  { id: 'student_3', name: 'David Brown', email: 'david.brown@email.com', role: 'student' },
];

function NewMessageModal({ open, onOpenChange, onSendMessage, recipient }: NewMessageModalProps) {
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    priority: 'normal' as 'low' | 'normal' | 'high',
  });

  const [selectedRecipient, setSelectedRecipient] = useState(recipient || null);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (recipient) {
      setSelectedRecipient(recipient);
    }
  }, [recipient]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term) {
      const filtered = mockUsers.filter(user =>
        user.name.toLowerCase().includes(term.toLowerCase()) ||
        user.email.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(mockUsers);
    }
  };

  const handleSend = () => {
    if (!selectedRecipient || !formData.subject.trim() || !formData.content.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    onSendMessage({
      subject: formData.subject,
      content: formData.content,
      recipient: selectedRecipient,
      priority: formData.priority,
    });

    onOpenChange(false);
    setFormData({
      subject: '',
      content: '',
      priority: 'normal',
    });
    setSelectedRecipient(null);
    setSearchTerm('');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'instructor': return <UserCheck className="w-4 h-4" />;
      case 'student': return <GraduationCap className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'instructor': return 'bg-blue-100 text-blue-800';
      case 'student': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden p-0 bg-gradient-to-br from-white to-gray-50">
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Compose Message</h2>
                  <p className="text-sm text-gray-500">Send a message to instructors or students</p>
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
        </div>
        
        <div className="px-6 py-6 space-y-6 max-h-[calc(85vh-120px)] overflow-y-auto">
          {/* Recipient Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Send To:</label>
            {selectedRecipient ? (
              <div className="relative">
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl transition-all duration-200">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      {getRoleIcon(selectedRecipient.role)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{selectedRecipient.name}</p>
                    <p className="text-xs text-gray-600">{selectedRecipient.email}</p>
                  </div>
                  <Badge className={`${getRoleBadgeColor(selectedRecipient.role)} text-xs px-2 py-1`}>
                    {selectedRecipient.role}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedRecipient(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search for instructors or students..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-12 h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>
                {searchTerm && (
                  <div className="mt-3 max-h-48 overflow-y-auto border border-gray-200 rounded-xl bg-white shadow-lg">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors duration-150"
                          onClick={() => {
                            setSelectedRecipient({
                              id: user.id,
                              name: user.name,
                              email: user.email,
                              role: user.role,
                            });
                            setSearchTerm('');
                          }}
                        >
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            {getRoleIcon(user.role)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                          <Badge className={getRoleBadgeColor(user.role)}>
                            {user.role}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No users found</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Subject and Priority Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
              <Input
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="What's this message about?"
                className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as 'low' | 'normal' | 'high' }))}
                className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
              >
                <option value="low">🟢 Low Priority</option>
                <option value="normal">🟡 Normal Priority</option>
                <option value="high">🔴 High Priority</option>
              </select>
            </div>
          </div>

          {/* Message Content */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Write your message here... Be clear and professional."
              rows={8}
              className="border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200 resize-none"
            />
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <span>Be professional and respectful</span>
              <span>{formData.content.length} characters</span>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {selectedRecipient ? (
              <span>Ready to send to {selectedRecipient.name}</span>
            ) : (
              <span>Select a recipient to continue</span>
            )}
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="px-6 py-2 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSend} 
              disabled={!selectedRecipient || !formData.subject.trim() || !formData.content.trim()}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl flex items-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              Send Message
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [newMessageRecipient, setNewMessageRecipient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Handle URL parameters for pre-populating recipient
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const recipient = params.get('recipient');
      const recipientName = params.get('recipientName');
      const recipientRole = params.get('recipientRole');
      const recipientId = params.get('recipientId');

      if (recipient && recipientName && recipientRole && recipientId) {
        const recipientData = {
          id: recipientId,
          name: recipientName,
          email: recipient,
          role: recipientRole,
        };
        setNewMessageRecipient(recipientData);
        setShowNewMessageModal(true);
        
        // Clean up URL parameters after handling them
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, []);

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/messages');
      const data = await response.json();
      
      if (data.success && data.conversations) {
        // Convert conversations to message format for compatibility with existing UI
        const convertedMessages: Message[] = data.conversations.map((conv: any) => ({
          id: conv.id,
          subject: conv.title || conv.lastMessage.substring(0, 50) + '...',
          content: conv.lastMessage,
          sender: {
            id: conv.lastMessageSenderId || 'unknown',
            name: conv.lastMessageSender || 'Unknown',
            email: '',
            role: conv.lastMessageSenderRole || 'student',
          },
          recipient: {
            id: 'admin_1',
            name: 'Admin',
            email: 'admin@driveuk.com',
            role: 'admin',
          },
          timestamp: conv.lastMessageTime,
          isRead: conv.unreadCount === 0,
          isStarred: false,
          isArchived: false,
          priority: 'normal' as const,
        }));
        
        setMessages(convertedMessages);
      } else {
        console.warn('No messages found, using mock data');
        setMessages(mockMessages);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setError('Failed to load messages');
      // Fallback to mock data on error
      setMessages(mockMessages);
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter((message) => {
    const matchesSearch = 
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || message.sender.role === filterRole;
    
    const matchesStatus = 
      filterStatus === 'all' ||
      (filterStatus === 'unread' && !message.isRead) ||
      (filterStatus === 'starred' && message.isStarred) ||
      (filterStatus === 'archived' && message.isArchived);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleComposeMessage = (recipient?: any) => {
    setNewMessageRecipient(recipient);
    setShowNewMessageModal(true);
  };

  const handleSendMessage = async (messageData: {
    subject: string;
    content: string;
    recipient: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
    priority: 'low' | 'normal' | 'high';
  }) => {
    try {
      const response = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: messageData.content,
          recipientId: messageData.recipient.id,
          subject: messageData.subject,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('Message sent successfully:', data.message);
        
        // Create new message object for UI update
        const newMessage: Message = {
          id: data.data.id,
          subject: messageData.subject,
          content: messageData.content,
          sender: {
            id: data.data.senderId,
            name: data.data.senderName,
            email: 'admin@driveuk.com',
            role: 'admin',
          },
          recipient: {
            id: messageData.recipient.id,
            name: messageData.recipient.name,
            email: messageData.recipient.email,
            role: messageData.recipient.role as 'admin' | 'instructor' | 'student',
          },
          timestamp: data.data.timestamp,
          isRead: true,
          isStarred: false,
          isArchived: false,
          priority: messageData.priority,
        };

        // Add to messages list
        setMessages(prevMessages => [newMessage, ...prevMessages]);
        
        // Refresh the full message list to get the latest conversations
        setTimeout(() => fetchMessages(), 1000);
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
    
    // Show success notification
    alert('Message sent successfully!');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'instructor': return <UserCheck className="w-4 h-4" />;
      case 'student': return <GraduationCap className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: '2-digit' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MessageSquare className="w-8 h-8" />
            Messages
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage communications with instructors and students
          </p>
        </div>
        <Button onClick={() => handleComposeMessage()} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Message
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold">{messages.length}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-red-600">
                  {messages.filter(m => !m.isRead).length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Starred</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {messages.filter(m => m.isStarred).length}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-orange-600">
                  {messages.filter(m => m.priority === 'high').length}
                </p>
              </div>
              <Filter className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-[180px]"
            >
              <option value="all">All Roles</option>
              <option value="instructor">Instructors</option>
              <option value="student">Students</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-[180px]"
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread</option>
              <option value="starred">Starred</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <Card>
        <CardHeader>
          <CardTitle>Messages ({filteredMessages.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No messages found</p>
              </div>
            ) : (
              filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !message.isRead ? 'bg-blue-50/50' : ''
                  }`}
                  onClick={() => setSelectedMessage(message)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getRoleIcon(message.sender.role)}
                        <span className="font-medium text-sm">
                          {message.sender.name}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {message.sender.role}
                        </Badge>
                        {!message.isRead && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                        {message.isStarred && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                        <Badge className={`text-xs ${getPriorityColor(message.priority)}`}>
                          {message.priority}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-gray-900 truncate">
                        {message.subject}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {message.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(message.timestamp)}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Reply className="w-4 h-4 mr-2" />
                            Reply
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Star className="w-4 h-4 mr-2" />
                            {message.isStarred ? 'Unstar' : 'Star'}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="w-4 h-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* New Message Modal */}
      <NewMessageModal
        open={showNewMessageModal}
        onOpenChange={setShowNewMessageModal}
        onSendMessage={handleSendMessage}
        recipient={newMessageRecipient}
      />
    </div>
  );
}