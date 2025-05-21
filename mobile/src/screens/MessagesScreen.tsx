
import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { theme } from '../components/ThemeConfig';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface Conversation {
  id: number;
  contact: {
    name: string;
    email: string;
  };
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

export default function MessagesScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([
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
  ]);

  const filteredConversations = conversations.filter(conversation => 
    conversation.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navigateToChat = (conversation: Conversation) => {
    navigation.navigate(
      'Chat' as never,
      { clientName: conversation.contact.name, conversation } as never
    );
  };

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity 
      style={styles.conversationItem}
      onPress={() => navigateToChat(item)}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.contact.name.split(' ').map(n => n[0]).join('')}
        </Text>
      </View>
      
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.contactName}>{item.contact.name}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        
        <View style={styles.conversationFooter}>
          <Text 
            style={[styles.lastMessage, item.unread && styles.unreadMessage]} 
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          {item.unread && <View style={styles.unreadIndicator} />}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={theme.colors.grey} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search messages..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={theme.colors.grey}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={theme.colors.grey} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      
      {filteredConversations.length > 0 ? (
        <FlatList
          data={filteredConversations}
          renderItem={renderConversation}
          keyExtractor={item => item.id.toString()}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubbles-outline" size={60} color={theme.colors.grey} />
          <Text style={styles.emptyText}>No messages found</Text>
          {searchQuery ? (
            <Text style={styles.emptySubText}>Try a different search term</Text>
          ) : (
            <Text style={styles.emptySubText}>
              When you start conversations with clients, they'll appear here
            </Text>
          )}
        </View>
      )}
      
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="create" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.roundness,
    paddingHorizontal: theme.spacing.md,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 46,
    color: theme.colors.text,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: '#FFFFFF',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: theme.colors.grey,
  },
  conversationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: theme.colors.grey,
    flex: 1,
  },
  unreadMessage: {
    color: theme.colors.text,
    fontWeight: '500',
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
  emptySubText: {
    color: theme.colors.grey,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    right: theme.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
