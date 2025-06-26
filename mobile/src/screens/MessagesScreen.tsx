
import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { theme } from '../components/ThemeConfig';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useConversations } from '../hooks/useConversations';
import { Conversation } from '../types/conversations';

export default function MessagesScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use real conversations from database
  const { data: conversations = [], isLoading } = useConversations();

  const filteredConversations = conversations.filter(conversation => 
    conversation.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.client_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.messages?.some(msg => 
      msg.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const navigateToChat = (conversation: Conversation) => {
    navigation.navigate(
      'Chat' as never,
      { clientName: conversation.client_name, conversation } as never
    );
  };

  const renderConversation = ({ item }: { item: Conversation }) => {
    const lastMessage = item.messages?.[item.messages.length - 1];
    
    return (
      <TouchableOpacity 
        style={styles.conversationItem}
        onPress={() => navigateToChat(item)}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.client_name?.split(' ').map(n => n[0]).join('') || 'U'}
          </Text>
        </View>
        
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={styles.contactName}>{item.client_name || 'Unknown'}</Text>
            <Text style={styles.timestamp}>
              {new Date(item.updated_at).toLocaleDateString()}
            </Text>
          </View>
          
          <View style={styles.conversationFooter}>
            <Text 
              style={styles.lastMessage} 
              numberOfLines={1}
            >
              {lastMessage?.content || 'No messages yet'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="chatbubbles-outline" size={64} color={theme.colors.grey} />
      <Text style={styles.emptyTitle}>No conversations yet</Text>
      <Text style={styles.emptyDescription}>
        You haven't started any conversations yet. Begin engaging with your leads to build relationships.
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={theme.colors.grey} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search conversations..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={theme.colors.grey}
            />
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading conversations...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={theme.colors.grey} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={theme.colors.grey}
          />
        </View>
      </View>

      <FlatList
        data={filteredConversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id.toString()}
        style={styles.conversationsList}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: theme.colors.grey,
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.grey,
  },
});
