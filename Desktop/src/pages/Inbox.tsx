
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Send, Paperclip } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useLocation } from 'react-router-dom';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';

const mockConversations = [
  {
    id: 1,
    contact: { name: 'Emma Thompson', email: 'emma@example.com' },
    lastMessage: "Hi there, I'm interested in the property at 123 Main St. Is it still available?",
    timestamp: '10:43 AM',
    unread: true
  },
  {
    id: 2,
    contact: { name: 'Michael Chen', email: 'michael@example.com' },
    lastMessage: "Thanks for showing me the house yesterday. I have a few more questions.",
    timestamp: 'Yesterday',
    unread: false
  },
  {
    id: 3,
    contact: { name: 'Sarah Johnson', email: 'sarah@example.com' },
    lastMessage: "I'd like to make an offer on the Oak Street property.",
    timestamp: 'Yesterday',
    unread: true
  },
  {
    id: 4,
    contact: { name: 'David Rodriguez', email: 'david@example.com' },
    lastMessage: "When can we schedule the next viewing?",
    timestamp: 'Monday',
    unread: false
  },
];

const mockMessages = [
  {
    id: 1,
    sender: 'Emma Thompson',
    content: "Hi there, I'm interested in the property at 123 Main St. Is it still available?",
    timestamp: '10:43 AM',
    isClient: true
  },
  {
    id: 2,
    sender: 'Me',
    content: "Hello Emma! Yes, 123 Main St is still available. Would you like to schedule a viewing?",
    timestamp: '10:45 AM',
    isClient: false
  },
  {
    id: 3,
    sender: 'Emma Thompson',
    content: "That sounds great! I'm available this weekend, either Saturday afternoon or Sunday morning. What works for you?",
    timestamp: '11:02 AM',
    isClient: true
  },
  {
    id: 4,
    sender: 'Me',
    content: "I can do Saturday at 2 PM. Does that work for you? The property has 3 bedrooms, 2 baths, and was recently renovated.",
    timestamp: '11:10 AM',
    isClient: false
  },
];

export const Inbox = () => {
  const location = useLocation();
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [message, setMessage] = useState('');

  // Handle navigation from dashboard
  useEffect(() => {
    if (location.state?.selectedConversationId) {
      const conversationId = location.state.selectedConversationId;
      const conversation = mockConversations.find(conv => conv.id === conversationId);
      if (conversation) {
        setSelectedConversation(conversation);
      }
    }
  }, [location.state]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
        <Button>Compose</Button>
      </div>

      <div className="grid md:grid-cols-12 gap-6 h-[calc(100vh-12rem)] min-h-[500px]">
        {/* Conversation List */}
        <div className="md:col-span-4 lg:col-span-3 border rounded-md overflow-hidden flex flex-col">
          <div className="p-3 border-b bg-muted/30">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search conversations..."
                className="w-full pl-8"
              />
            </div>
          </div>
          <div className="overflow-auto flex-1">
            {mockConversations.map((conversation) => (
              <div 
                key={conversation.id}
                className={`p-3 border-b cursor-pointer hover:bg-muted/50 ${selectedConversation.id === conversation.id ? 'bg-muted/70' : ''}`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {conversation.contact.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-medium truncate">
                        {conversation.contact.name}
                      </h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-1">
                        {conversation.timestamp}
                      </span>
                    </div>
                    <p className={`text-sm truncate ${conversation.unread ? 'font-medium' : 'text-muted-foreground'}`}>
                      {conversation.lastMessage}
                    </p>
                  </div>
                  {conversation.unread && (
                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversation Detail */}
        <div className="md:col-span-8 lg:col-span-9 border rounded-md overflow-hidden flex flex-col">
          <div className="p-3 border-b bg-muted/30">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback>
                  {selectedConversation.contact.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{selectedConversation.contact.name}</h3>
                <p className="text-xs text-muted-foreground">{selectedConversation.contact.email}</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {mockMessages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.isClient ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-[80%] ${msg.isClient ? '' : 'flex flex-col items-end'}`}>
                  {msg.isClient && (
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>{msg.sender.split(' ')[0][0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{msg.sender}</span>
                      <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                    </div>
                  )}
                  <Card className={`${msg.isClient ? '' : 'bg-primary text-primary-foreground'}`}>
                    <CardContent className="p-3 text-sm">
                      {msg.content}
                    </CardContent>
                  </Card>
                  {!msg.isClient && (
                    <span className="text-xs text-muted-foreground mt-1">{msg.timestamp}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-3 border-t">
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Textarea 
                className="min-h-[40px] resize-none"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    // Handle send
                    console.log('Sending:', message);
                    setMessage('');
                  }
                }}
              />
              <Button size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inbox;
