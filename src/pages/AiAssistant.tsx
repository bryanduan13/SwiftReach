
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, Send, User } from 'lucide-react';
import { cn } from '@/lib/utils';

type Message = {
  id: number;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

export const AiAssistant = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! I'm your real estate AI assistant. I can help with lead follow-up suggestions, property information, market trends, and more. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponses: {[key: string]: string} = {
        'lead': "For effective lead follow-up, I recommend making initial contact within 5 minutes, then following up at 3 days, 1 week, and 2 weeks with personalized messages. Would you like me to draft some follow-up templates for you?",
        'market': "Based on recent data, the local market has seen a 5% increase in home values over the past quarter. Inventory is currently low, making it a seller's market in most neighborhoods. Would you like more specific information about a particular area?",
        'property': "When discussing property features with clients, focus on highlighting unique selling points like location benefits, recent upgrades, and lifestyle advantages rather than just listing features. Would you like help creating compelling property descriptions?",
        'script': "Here's a proven call script for new leads: 'Hi [name], this is [your name] from RealEstate CRM. I noticed you were interested in properties in [area]. I have some great options that might work for you. Do you have a moment to discuss what you're looking for?'"
      };

      // Determine which response to use based on keywords in user message
      let responseText = "I'll help you with that! To give you the most relevant information, could you provide more details about what you're looking for?";
      
      const lowerCaseInput = input.toLowerCase();
      if (lowerCaseInput.includes('lead') || lowerCaseInput.includes('follow up') || lowerCaseInput.includes('prospect')) {
        responseText = aiResponses.lead;
      } else if (lowerCaseInput.includes('market') || lowerCaseInput.includes('trend') || lowerCaseInput.includes('prices')) {
        responseText = aiResponses.market;
      } else if (lowerCaseInput.includes('property') || lowerCaseInput.includes('house') || lowerCaseInput.includes('feature')) {
        responseText = aiResponses.property;
      } else if (lowerCaseInput.includes('script') || lowerCaseInput.includes('what to say') || lowerCaseInput.includes('call')) {
        responseText = aiResponses.script;
      }

      const aiMessage: Message = {
        id: messages.length + 2,
        content: responseText,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        <Card className="md:col-span-8 lg:col-span-9">
          <CardHeader>
            <CardTitle>Chat with your AI Assistant</CardTitle>
          </CardHeader>
          <CardContent className="h-[calc(100vh-16rem)] min-h-[400px] flex flex-col">
            <div className="flex-1 overflow-auto space-y-4 mb-4 p-1">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3 max-w-[80%]",
                    message.sender === 'user' ? "ml-auto" : ""
                  )}
                >
                  {message.sender === 'ai' && (
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "rounded-lg p-3",
                      message.sender === 'user'
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {message.content}
                  </div>
                  {message.sender === 'user' && (
                    <Avatar>
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Textarea
                placeholder="Type your question here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="min-h-[60px] resize-none"
              />
              <Button onClick={handleSendMessage} className="self-end">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Prompts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              "Generate follow-up message for new lead",
              "Draft a property description for marketing",
              "What are current market trends?",
              "Create a script for cold calling",
              "Tips for negotiating with buyers"
            ].map((prompt, index) => (
              <Button 
                key={index} 
                variant="outline" 
                className="w-full justify-start h-auto py-3 text-left" 
                onClick={() => {
                  setInput(prompt);
                }}
              >
                {prompt}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AiAssistant;
