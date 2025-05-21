
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ClientsScreen from '../screens/ClientsScreen';
import ClientDetailScreen from '../screens/ClientDetailScreen';
import CalendarScreen from '../screens/CalendarScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';

import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#FAF3E0' },
      headerTintColor: '#3E2723',
      headerTitleStyle: { fontWeight: 'bold' }
    }}
  >
    <Stack.Screen 
      name="Login" 
      component={LoginScreen} 
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="Signup" 
      component={SignupScreen} 
      options={{ title: 'Create Account' }}
    />
  </Stack.Navigator>
);

const ClientsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#FAF3E0' },
      headerTintColor: '#3E2723',
      headerTitleStyle: { fontWeight: 'bold' }
    }}
  >
    <Stack.Screen name="ClientsList" component={ClientsScreen} options={{ title: 'Clients' }} />
    <Stack.Screen name="ClientDetail" component={ClientDetailScreen} options={{ title: 'Client Details' }} />
  </Stack.Navigator>
);

const MessagesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#FAF3E0' },
      headerTintColor: '#3E2723',
      headerTitleStyle: { fontWeight: 'bold' }
    }}
  >
    <Stack.Screen name="MessagesList" component={MessagesScreen} options={{ title: 'Messages' }} />
    <Stack.Screen name="Chat" component={ChatScreen} options={({ route }) => ({ title: (route.params as any)?.clientName || 'Chat' })} />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#F57C00',
      tabBarInactiveTintColor: '#3E2723',
      tabBarStyle: { backgroundColor: '#FAF3E0' },
      headerStyle: { backgroundColor: '#FAF3E0' },
      headerTintColor: '#3E2723',
      headerTitleStyle: { fontWeight: 'bold' }
    }}
  >
    <Tab.Screen 
      name="Dashboard" 
      component={DashboardScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home-outline" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen 
      name="Clients" 
      component={ClientsStack}
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="people-outline" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen 
      name="Calendar" 
      component={CalendarScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="calendar-outline" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen 
      name="Messages" 
      component={MessagesStack}
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="chatbox-outline" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person-outline" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { isLoading, session } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAF3E0' }}>
        <ActivityIndicator size="large" color="#F57C00" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!session ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : (
        <Stack.Screen name="Main" component={MainTabs} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
