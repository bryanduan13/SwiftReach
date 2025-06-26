
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Send, Paperclip, MessageSquare, Plus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useLocation } from 'react-router-dom';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useConversations, useCreateConversation } from '@/hooks/useConversations';
import { useQuery } from '@tanstack/react-query';
import { clientsApi } from '../../../client/api';
import { Conversation, MessageType, MessageDirection } from '@/types/conversations';
import { toast } from '@/hooks/use-toast';

export const Inbox = () => {
  const location = useLocation();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [message, setMessage] = useState('');
  const [isStartConversationOpen, setIsStartConversationOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [conversationMessage, setConversationMessage] = useState('');
  const [messageType, setMessageType] = useState<MessageType>(MessageType.EMAIL);
  
  // Use real conversations from database
  const { data: conversations = [], isLoading } = useConversations();
  const createConversationMutation = useCreateConversation();
  
  // Fetch leads for conversation creation
  const { data: leads = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await clientsApi.getClients({ limit: 100 });
      return response.data;
    },
  });

  // Handle navigation from dashboard
  useEffect(() => {
    if (location.state?.selectedConversationId && conversations.length > 0) {
      const conversationId = location.state.selectedConversationId;
      const conversation = conversations.find(conv => conv.id === conversationId);
      if (conversation) {
        setSelectedConversation(conversation);
      }
    } else if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0]);
    }
  }, [location.state, conversations, selectedConversation]);

  const handleStartConversation = async () => {
    console.log('Button clicked!'); // Add this line
    console.log('Selected Lead ID:', selectedLeadId); // Add this line
    console.log('Message:', conversationMessage); // Add this line
    
    if (!selectedLeadId || !conversationMessage.trim()) {
      toast({
        title: 'Error',
        description: 'Please select a lead and enter a message',
        variant: 'destructive',
      });
      return;
    }
  
    try {
      console.log('About to call API...'); // Add this line
      await createConversationMutation.mutateAsync({
        client_id: selectedLeadId,
        message_type: messageType,
        direction: MessageDirection.OUTBOUND,
        content: conversationMessage,
        subject: `New conversation with ${leads.find(l => l.id === selectedLeadId)?.first_name} ${leads.find(l => l.id === selectedLeadId)?.last_name}`,
      });
      
      console.log('API call successful!'); // Add this line
      // Reset form and close dialog
      setSelectedLeadId('');
      setConversationMessage('');
      setIsStartConversationOpen(false);
      
      toast({
        title: 'Success',
        description: 'Conversation started successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start conversation',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
          <Button>Compose</Button>
        </div>
        <div className="text-center py-12">
          <p>Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
        <Button>Compose</Button>
      </div>

      {/* Conditional rendering: Show empty state or conversations */}
      {conversations.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto max-w-md">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't started any conversations yet. Begin engaging with your leads to build relationships and close deals.
            </p>
            <Button onClick={() => setIsStartConversationOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Start First Conversation
            </Button>
          </div>
        </div>
      ) : (
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
              {conversations.map((conversation) => (
                <div 
                  key={conversation.id}
                  className={`p-3 border-b cursor-pointer hover:bg-muted/50 ${
                    selectedConversation?.id === conversation.id ? 'bg-muted/70' : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {conversation.client_name?.split(' ').map(n => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-medium truncate">
                          {conversation.client_name || 'Unknown'}
                        </h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-1">
                          {new Date(conversation.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm truncate text-muted-foreground">
                        {conversation.messages?.[conversation.messages.length - 1]?.content || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conversation Detail */}
          {selectedConversation && (
            <div className="md:col-span-8 lg:col-span-9 border rounded-md overflow-hidden flex flex-col">
              <div className="p-3 border-b bg-muted/30">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>
                      {selectedConversation.client_name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedConversation.client_name || 'Unknown'}</h3>
                    <p className="text-xs text-muted-foreground">{selectedConversation.client_email}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-auto p-4 space-y-4">
                {selectedConversation.messages?.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${
                      msg.direction === 'inbound' ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    <div className={`max-w-[80%] ${
                      msg.direction === 'inbound' ? '' : 'flex flex-col items-end'
                    }`}>
                      {msg.direction === 'inbound' && (
                        <div className="flex items-center gap-2 mb-1">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>
                              {selectedConversation.client_name?.split(' ')[0][0] || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{selectedConversation.client_name}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      )}
                      <Card className={`${
                        msg.direction === 'inbound' ? '' : 'bg-primary text-primary-foreground'
                      }`}>
                        <CardContent className="p-3 text-sm">
                          {msg.content}
                        </CardContent>
                      </Card>
                      {msg.direction === 'outbound' && (
                        <span className="text-xs text-muted-foreground mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8 text-muted-foreground">
                    No messages in this conversation yet.
                  </div>
                )}
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
                        // TODO: Implement send message functionality
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
          )}
        </div>
      )}

      {/* Start Conversation Dialog */}
      <Dialog open={isStartConversationOpen} onOpenChange={setIsStartConversationOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Start New Conversation</DialogTitle>
            <DialogDescription>
              Select a lead and compose your first message to start a conversation.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Lead</label>
              <Select value={selectedLeadId} onValueChange={setSelectedLeadId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a lead to message" />
                </SelectTrigger>
                <SelectContent>
                  {leads.map((lead) => (
                    <SelectItem key={lead.id} value={lead.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>
                            {`${lead.first_name?.[0] || ''}${lead.last_name?.[0] || ''}`.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{`${lead.first_name} ${lead.last_name}`}</div>
                          <div className="text-xs text-muted-foreground">{lead.email}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Message Type</label>
              <Select value={messageType} onValueChange={(value) => setMessageType(value as MessageType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={MessageType.EMAIL}>Email</SelectItem>
                  <SelectItem value={MessageType.SMS}>SMS</SelectItem>
                  <SelectItem value={MessageType.WHATSAPP}>WhatsApp</SelectItem>
                  <SelectItem value={MessageType.NOTE}>Note</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                placeholder="Type your message here..."
                value={conversationMessage}
                onChange={(e) => setConversationMessage(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsStartConversationOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleStartConversation}
              disabled={createConversationMutation.isPending || !selectedLeadId || !conversationMessage.trim()}
            >
              {createConversationMutation.isPending ? 'Starting...' : 'Start Conversation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inbox;
