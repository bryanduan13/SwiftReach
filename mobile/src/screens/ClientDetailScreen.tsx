
import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../components/ThemeConfig';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ClientDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const client = (route.params as any)?.client || {
    first_name: 'Unknown',
    last_name: 'Client',
    email: null,
    phone: null,
    status: null
  };

  // For demo purposes - in a real app, you would fetch this data from your API
  const notes = [
    { id: 1, date: '2025-05-15', content: 'Initial consultation. Client is interested in 3-bedroom homes in the north side of town.' },
    { id: 2, date: '2025-05-18', content: 'Showed 3 properties. Client liked the one on Oak Street the most, but wants to see more options.' }
  ];

  const upcomingEvents = [
    { id: 1, type: 'showing', date: '2025-05-25', time: '10:00 AM', location: '123 Pine Avenue' },
    { id: 2, type: 'call', date: '2025-05-22', time: '2:30 PM', location: 'Phone' }
  ];

  const renderContactInfo = () => {
    return (
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Contact Information</Text>
        
        <View style={styles.infoItem}>
          <Ionicons name="mail-outline" size={20} color={theme.colors.text} style={styles.infoIcon} />
          <View>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{client.email || 'Not provided'}</Text>
          </View>
        </View>
        
        <View style={styles.infoItem}>
          <Ionicons name="call-outline" size={20} color={theme.colors.text} style={styles.infoIcon} />
          <View>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{client.phone || 'Not provided'}</Text>
          </View>
        </View>
        
        <View style={styles.infoItem}>
          <Ionicons name="bookmark-outline" size={20} color={theme.colors.text} style={styles.infoIcon} />
          <View>
            <Text style={styles.infoLabel}>Status</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{client.status || 'Unknown'}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderUpcomingEvents = () => {
    if (upcomingEvents.length === 0) {
      return (
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Upcoming Events</Text>
          <Text style={styles.emptyText}>No upcoming events</Text>
        </View>
      );
    }

    return (
      <View style={styles.infoCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Upcoming Events</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {upcomingEvents.map(event => (
          <View key={event.id} style={styles.eventItem}>
            <View style={[styles.eventIndicator, event.type === 'showing' ? styles.showingEvent : styles.callEvent]} />
            <View style={styles.eventDetails}>
              <Text style={styles.eventType}>
                {event.type === 'showing' ? 'Property Showing' : 'Phone Call'}
              </Text>
              <Text style={styles.eventDateTime}>
                {event.date} at {event.time}
              </Text>
              <Text style={styles.eventLocation}>
                {event.location}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderNotes = () => {
    if (notes.length === 0) {
      return (
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Notes</Text>
          <Text style={styles.emptyText}>No notes available</Text>
        </View>
      );
    }

    return (
      <View style={styles.infoCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Notes</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Add Note</Text>
          </TouchableOpacity>
        </View>
        
        {notes.map(note => (
          <View key={note.id} style={styles.noteItem}>
            <Text style={styles.noteDate}>{note.date}</Text>
            <Text style={styles.noteContent}>{note.content}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarTextLarge}>
            {client.first_name.charAt(0)}{client.last_name.charAt(0)}
          </Text>
        </View>
        <Text style={styles.clientName}>
          {`${client.first_name} ${client.last_name}`}
        </Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate(
              'Messages' as never, 
              { screen: 'Chat', params: { clientName: `${client.first_name} ${client.last_name}` } } as never
            )}
          >
            <Ionicons name="chatbubble" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="call" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="calendar" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {renderContactInfo()}
        {renderUpcomingEvents()}
        {renderNotes()}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: theme.spacing.xl,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  avatarLarge: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarTextLarge: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 32,
  },
  clientName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: theme.spacing.sm,
  },
  content: {
    padding: theme.spacing.md,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.roundness,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  seeAllText: {
    color: theme.colors.primary,
    fontWeight: '500',
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  infoIcon: {
    marginRight: theme.spacing.md,
    marginTop: 2,
  },
  infoLabel: {
    fontSize: 12,
    color: theme.colors.grey,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: theme.colors.text,
  },
  statusBadge: {
    backgroundColor: 'rgba(245, 124, 0, 0.1)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  emptyText: {
    color: theme.colors.grey,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  eventItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  eventIndicator: {
    width: 4,
    borderRadius: 2,
    marginRight: theme.spacing.md,
  },
  showingEvent: {
    backgroundColor: theme.colors.primary,
  },
  callEvent: {
    backgroundColor: theme.colors.accent,
  },
  eventDetails: {
    flex: 1,
  },
  eventType: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 2,
  },
  eventDateTime: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 2,
  },
  eventLocation: {
    fontSize: 14,
    color: theme.colors.grey,
  },
  noteItem: {
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.secondary,
  },
  noteDate: {
    fontSize: 14,
    color: theme.colors.grey,
    marginBottom: theme.spacing.xs,
  },
  noteContent: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 22,
  },
});
