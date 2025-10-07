'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import ConversationSearch from './components/ConversationSearch';
import ConversationList from './components/ConversationList';
import MessageHeader from './components/MessageHeader';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import EmptyState from './components/EmptyState';
import { mockConversations, mockMessages, filterConversations } from './components/utils';

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1');
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations] = useState(mockConversations);
  const [messages] = useState(mockMessages);

  const filteredConversations = filterConversations(conversations, searchQuery);
  const selectedConversationData = conversations.find(c => c.id === selectedConversation);
  const currentMessages = selectedConversation ? messages[selectedConversation] || [] : [];

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Messages</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Stay connected with your instructors and support team
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          <div className="lg:col-span-1">
            <Card className="h-full flex flex-col">
              <div className="flex-shrink-0">
                <div className="p-4 border-b">
                  <div className="flex items-center mb-4">
                    <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
                    <h2 className="text-lg font-semibold">Conversations</h2>
                  </div>
                  <ConversationSearch
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                <ConversationList
                  conversations={filteredConversations}
                  selectedConversation={selectedConversation}
                  onSelectConversation={setSelectedConversation}
                />
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="h-full flex flex-col">
              {selectedConversation && selectedConversationData ? (
                <>
                  <MessageHeader conversation={selectedConversationData} />
                  <CardContent className="flex-1 flex flex-col p-0">
                    <MessageList messages={currentMessages} />
                    <MessageInput
                      newMessage={newMessage}
                      onMessageChange={setNewMessage}
                      onSendMessage={handleSendMessage}
                    />
                  </CardContent>
                </>
              ) : (
                <EmptyState />
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
