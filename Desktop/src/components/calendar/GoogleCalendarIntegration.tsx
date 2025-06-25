
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Check, Calendar as CalendarIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';

const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID"; // Replace with your Google Client ID
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events";

export const GoogleCalendarIntegration = () => {
  const [connected, setConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = () => {
    setIsLoading(true);
    
    // This is a placeholder for Google Calendar OAuth
    // In a real implementation, you would use the Google API client library
    // and set up the OAuth flow properly
    
    // Simulating the OAuth process
    setTimeout(() => {
      setConnected(true);
      setIsLoading(false);
      toast({
        title: "Google Calendar connected",
        description: "Your Google Calendar has been successfully connected.",
      });
    }, 1500);
  };

  const handleDisconnect = () => {
    setConnected(false);
    toast({
      title: "Google Calendar disconnected",
      description: "Your Google Calendar has been disconnected.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CalendarIcon className="h-6 w-6 mb-2 text-primary" />
        <CardTitle>Google Calendar Integration</CardTitle>
        <CardDescription>
          Connect your Google Calendar to sync events and manage everything in one place.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!connected ? (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Not connected</AlertTitle>
            <AlertDescription>
              You haven't connected Google Calendar yet. Connect to start syncing events.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="mb-4 bg-green-50 border-green-300 text-green-800">
            <Check className="h-4 w-4" />
            <AlertTitle>Connected</AlertTitle>
            <AlertDescription>
              Your Google Calendar is connected and syncing.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        {!connected ? (
          <Button 
            onClick={handleGoogleAuth} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Connecting...' : 'Connect Google Calendar'}
          </Button>
        ) : (
          <Button 
            variant="outline" 
            onClick={handleDisconnect} 
            className="w-full"
          >
            Disconnect
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default GoogleCalendarIntegration;
