'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Send, 
  Search, 
  Phone, 
  Video, 
  MoreVertical,
  Smile,
  Paperclip,
  Check,
  CheckCheck,
  Clock
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: Date;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  type: 'text' | 'image' | 'file';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  isMe: boolean;
}

export default function RealTimeChat() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Mock users data - generate only on client side
  const users: User[] = isClient ? [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: '/api/placeholder/40/40',
      status: 'online',
      lastSeen: new Date()
    },
    {
      id: '2', 
      name: 'Mike Chen',
      avatar: '/api/placeholder/40/40',
      status: 'offline',
      lastSeen: new Date(Date.now() - 3600000)
    },
    {
      id: '3',
      name: 'Emma Wilson', 
      avatar: '/api/placeholder/40/40',
      status: 'away',
      lastSeen: new Date(Date.now() - 1800000)
    }
  ] : [];

  // Load mock messages when user is selected
  useEffect(() => {
    if (!selectedUser || !isClient) return;
    
    const mockMessages: Message[] = [
      {
        id: '1',
        senderId: selectedUser.id,
        senderName: selectedUser.name,
        senderAvatar: selectedUser.avatar,
        content: 'Hi! I have a question about my upcoming driving lesson.',
        type: 'text',
        timestamp: new Date(Date.now() - 3600000),
        status: 'read',
        isMe: false
      },
      {
        id: '2',
        senderId: 'me',
        senderName: 'You',
        senderAvatar: '/api/placeholder/40/40',
        content: 'Hello! I would be happy to help. What is your question?',
        type: 'text',
        timestamp: new Date(Date.now() - 3300000),
        status: 'read',
        isMe: true
      },
      {
        id: '3',
        senderId: selectedUser.id,
        senderName: selectedUser.name,
        senderAvatar: selectedUser.avatar,
        content: 'What should I bring to my practical test next week?',
        type: 'text',
        timestamp: new Date(Date.now() - 1800000),
        status: 'delivered',
        isMe: false
      },
      {
        id: '4',
        senderId: 'me',
        senderName: 'You', 
        senderAvatar: '/api/placeholder/40/40',
        content: 'You will need to bring your provisional license, theory test certificate, and any glasses or contact lenses you normally wear.',
        type: 'text',
        timestamp: new Date(Date.now() - 900000),
        status: 'read',
        isMe: true
      },
      {
        id: '5',
        senderId: selectedUser.id,
        senderName: selectedUser.name,
        senderAvatar: selectedUser.avatar,
        content: "Great! Don't forget to bring your provisional license.",
        type: 'text',
        timestamp: new Date(Date.now() - 600000),
        status: 'sent',
        isMe: false
      }
    ];
    
    setMessages(mockMessages);
  }, [selectedUser, isClient]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedUser) return;
    
    const newMessage: Message = {
      id: isClient ? Date.now().toString() : Math.random().toString(),
      senderId: 'me',
      senderName: 'You',
      senderAvatar: '/api/placeholder/40/40',
      content: message.trim(),
      type: 'text',
      timestamp: new Date(),
      status: 'sending',
      isMe: true
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    
    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'sent' }
            : msg
        )
      );
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending':
        return <Clock className="w-3 h-3 text-gray-400" />;
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-500" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Chat Users List */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            Messages
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
          <div className="space-y-1 max-h-[400px] overflow-y-auto">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  selectedUser?.id === user.id ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500' : ''
                }`}
              >
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    user.status === 'online' ? 'bg-green-500' :
                    user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.status === 'online' ? 'Online' : `Last seen ${user.lastSeen ? formatTime(user.lastSeen) : 'recently'}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card className="lg:col-span-2">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                    <AvatarFallback>{selectedUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{selectedUser.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedUser.status === 'online' ? 'Online' : `Last seen ${selectedUser.lastSeen ? formatTime(selectedUser.lastSeen) : 'recently'}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
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
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="p-0 h-[400px] overflow-y-auto">
              <div className="p-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                    {!msg.isMe && (
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={msg.senderAvatar} alt={msg.senderName} />
                        <AvatarFallback>{msg.senderName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-xs lg:max-w-md ${msg.isMe ? 'order-1' : 'order-2'}`}>
                      <div className={`p-3 rounded-lg ${
                        msg.isMe 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                      <div className={`flex items-center gap-1 mt-1 ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
                        {msg.isMe && getStatusIcon(msg.status)}
                      </div>
                    </div>
                  </div>
                ))}
                {typingUsers.length > 0 && (
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                      <AvatarFallback>{selectedUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            {/* Message Input */}
            <div className="border-t p-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pr-10"
                  />
                  <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <Smile className="w-4 h-4" />
                  </Button>
                </div>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Select a conversation</h3>
              <p className="text-gray-500 dark:text-gray-400">Choose a student from the list to start messaging</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}