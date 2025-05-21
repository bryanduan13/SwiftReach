
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { theme } from '../components/ThemeConfig';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface ClientMessage {
  id: number;
  client: string;
  preview: string;
  time: string;
  unread: boolean;
}

export default function DashboardScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [recentMessages, setRecentMessages] = useState<ClientMessage[]>([
    { 
      id: 1,
      client: 'Emma Thompson', 
      preview: 'Hi there, I\'m interested in the property at 123 Main St. Is it still available?', 
      time: '10:43 AM',
      unread: true
    },
    { 
      id: 2,
      client: 'Michael Chen', 
      preview: 'Thanks for showing me the house yesterday. I have a few more questions about the financing options.', 
      time: 'Yesterday',
      unread: false
    },
    { 
      id: 3,
      client: 'Sarah Johnson', 
      preview: 'I\'d like to make an offer on the Oak Street property. Can we discuss the details?', 
      time: 'Yesterday',
      unread: true
    },
  ]);

  const handleRefresh = () => {
    setRefreshing(true);
    // Here you would fetch fresh data
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Welcome back, {user?.user_metadata?.full_name || 'Agent'}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>24</Text>
          <Text style={styles.statLabel}>Active Leads</Text>
          <View style={[styles.statIcon, { backgroundColor: 'rgba(245, 124, 0, 0.1)' }]}>
            <Ionicons name="people" size={20} color={theme.colors.primary} />
          </View>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>8</Text>
          <Text style={styles.statLabel}>Follow-ups Due</Text>
          <View style={[styles.statIcon, { backgroundColor: 'rgba(191, 54, 12, 0.1)' }]}>
            <Ionicons name="notifications" size={20} color={theme.colors.accent} />
          </View>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>Today's Events</Text>
          <View style={[styles.statIcon, { backgroundColor: 'rgba(215, 204, 200, 0.3)' }]}>
            <Ionicons name="calendar" size={20} color={theme.colors.text} />
          </View>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Messages</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Messages' as never)}
            style={styles.seeAllButton}
          >
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {recentMessages.map(message => (
          <TouchableOpacity 
            key={message.id}
            style={styles.messageCard}
            onPress={() => navigation.navigate(
              'Messages' as never, 
              { screen: 'Chat', params: { clientName: message.client } } as never
            )}
          >
            <View style={styles.messageHeader}>
              <View style={styles.messageSender}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{message.client.charAt(0)}</Text>
                </View>
                <Text style={styles.messageClient}>{message.client}</Text>
              </View>
              <View style={styles.messageTimeContainer}>
                <Text style={styles.messageTime}>{message.time}</Text>
                {message.unread && <View style={styles.unreadDot} />}
              </View>
            </View>
            <Text style={styles.messagePreview} numberOfLines={1}>
              {message.preview}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Appointments</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Calendar' as never)}
            style={styles.seeAllButton}
          >
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.appointmentCard, styles.showingAppointment]}>
          <View style={styles.appointmentTime}>
            <Text style={styles.appointmentTimeText}>10:00 AM</Text>
          </View>
          <View style={styles.appointmentDetails}>
            <Text style={styles.appointmentTitle}>Property Showing</Text>
            <Text style={styles.appointmentLocation}>123 Main St</Text>
            <Text style={styles.appointmentClient}>Emma Thompson</Text>
          </View>
        </View>

        <View style={[styles.appointmentCard, styles.meetingAppointment]}>
          <View style={styles.appointmentTime}>
            <Text style={styles.appointmentTimeText}>2:00 PM</Text>
          </View>
          <View style={styles.appointmentDetails}>
            <Text style={styles.appointmentTitle}>Client Meeting</Text>
            <Text style={styles.appointmentLocation}>Office</Text>
            <Text style={styles.appointmentClient}>Michael Chen</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.roundness,
    padding: theme.spacing.md,
    width: '31%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'flex-start',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.grey,
    marginTop: theme.spacing.xs,
  },
  statIcon: {
    position: 'absolute',
    right: theme.spacing.md,
    top: theme.spacing.md,
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.roundness,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  seeAllButton: {
    padding: theme.spacing.xs,
  },
  seeAllText: {
    color: theme.colors.primary,
    fontWeight: '500',
  },
  messageCard: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.secondary,
    paddingVertical: theme.spacing.sm,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  messageSender: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  messageClient: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  messageTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageTime: {
    fontSize: 12,
    color: theme.colors.grey,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginLeft: theme.spacing.xs,
  },
  messagePreview: {
    fontSize: 14,
    color: theme.colors.text,
    opacity: 0.8,
    marginLeft: 46, // align with the text, not with the avatar
  },
  appointmentCard: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
    borderRadius: theme.roundness,
    borderLeftWidth: 4,
    overflow: 'hidden',
  },
  showingAppointment: {
    borderLeftColor: theme.colors.primary,
    backgroundColor: 'rgba(245, 124, 0, 0.05)',
  },
  meetingAppointment: {
    borderLeftColor: theme.colors.accent,
    backgroundColor: 'rgba(191, 54, 12, 0.05)',
  },
  appointmentTime: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  appointmentTimeText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
  appointmentDetails: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
  appointmentLocation: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 2,
  },
  appointmentClient: {
    fontSize: 12,
    color: theme.colors.grey,
    marginTop: 2,
  },
});
