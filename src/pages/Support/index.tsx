import React, { useState } from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import ChatFilters from './ChatFilters';
import { ChatMessage, User } from '../../types';

export default function SupportPage() {
  const [selectedChat, setSelectedChat] = useState<User | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    date: ''
  });

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Chat List Sidebar */}
      <div className="w-96 flex flex-col border-r border-gray-200 bg-white">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold text-gray-900">Support</h1>
        </div>
        
        <ChatFilters filters={filters} onFilterChange={setFilters} />
        
        <div className="flex-1 overflow-y-auto">
          <ChatList 
            selectedChat={selectedChat}
            onChatSelect={setSelectedChat}
            filters={filters}
          />
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <ChatWindow chat={selectedChat} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">Select a chat to start messaging</h3>
              <p className="mt-1 text-sm text-gray-500">Choose from your conversations on the left</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}