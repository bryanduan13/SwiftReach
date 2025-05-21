
import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  SafeAreaView
} from 'react-native';
import { theme } from '../components/ThemeConfig';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  isClient: boolean;
}

export default function ChatScreen() {
  const route = useRoute();
  const { user } = useAuth();
  const clientName = (route.params as any)?.clientName || 'Client';
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: clientName,
      content: "Hi there, I'm interested in the property at 123 Main St. Is it still available?",
      timestamp: '10:43 AM',
      isClient: true
    },
    {
      id: 2,
      sender: 'Me',
      content: "Hello! Yes, 123 Main St is still available. Would you like to schedule a viewing?",
      timestamp: '10:45 AM',
      isClient: false
    },
    {
      id: 3,
      sender: clientName,
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
  ]);
  
  const flatListRef = useRef<FlatList>(null);
  
  // Scroll to bottom on initial render
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: false });
    }, 100);
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage: Message = {
      id: messages.length + 1,
      sender: 'Me',
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isClient: false
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    
    // Scroll to bottom after sending message
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageContainer, item.isClient ? styles.clientMessage : styles.agentMessage]}>
      {item.isClient && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.sender.charAt(0)}
          </Text>
        </View>
      )}
      
      <View style={[styles.messageBubble, item.isClient ? styles.clientBubble : styles.agentBubble]}>
        <Text style={[styles.messageText, item.isClient ? styles.clientText : styles.agentText]}>
          {item.content}
        </Text>
        <Text style={[styles.timestamp, item.isClient ? styles.clientTimestamp : styles.agentTimestamp]}>
          {item.timestamp}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />
        
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="attach" size={24} color={theme.colors.grey} />
          </TouchableOpacity>
          
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            placeholderTextColor={theme.colors.grey}
            value={message}
            onChangeText={setMessage}
            multiline
          />
          
          <TouchableOpacity 
            style={[styles.sendButton, !message.trim() && styles.disabledButton]}
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <Ionicons name="send" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  messagesList: {
    padding: theme.spacing.md,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    maxWidth: '80%',
  },
  clientMessage: {
    alignSelf: 'flex-start',
  },
  agentMessage: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.xs,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  messageBubble: {
    borderRadius: 18,
    padding: theme.spacing.md,
  },
  clientBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  agentBubble: {
    backgroundColor: theme.colors.primary,
  },
  messageText: {
    fontSize: 16,
  },
  clientText: {
    color: theme.colors.text,
  },
  agentText: {
    color: '#FFFFFF',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  clientTimestamp: {
    color: theme.colors.grey,
  },
  agentTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    alignItems: 'center',
  },
  attachButton: {
    padding: theme.spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginHorizontal: theme.spacing.sm,
    maxHeight: 100,
    color: theme.colors.text,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: theme.colors.grey,
  },
});
