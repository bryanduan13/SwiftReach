
import React from 'react';
import { ScrollView } from 'react-native';

// Import all screens here to make them type-safe
import DashboardScreen from './DashboardScreen';
import ClientsScreen from './ClientsScreen';
import ClientDetailScreen from './ClientDetailScreen';
import CalendarScreen from './CalendarScreen';
import MessagesScreen from './MessagesScreen';
import ChatScreen from './ChatScreen';
import ProfileScreen from './ProfileScreen';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';

// This is a placeholder component to ensure types are correctly picked up
export default function ImportScreens() {
  return (
    <ScrollView>
      {/* This component doesn't render anything */}
    </ScrollView>
  );
}

export {
  DashboardScreen,
  ClientsScreen,
  ClientDetailScreen,
  CalendarScreen,
  MessagesScreen,
  ChatScreen,
  ProfileScreen,
  LoginScreen,
  SignupScreen
};
