
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';
import { theme } from '../components/ThemeConfig';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

interface Event {
  id: number;
  title: string;
  client: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'showing' | 'meeting' | 'open-house' | 'call';
}

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Property Showing",
      client: "Emma Thompson",
      location: "123 Main St",
      date: "2025-05-22",
      startTime: "10:00 AM",
      endTime: "11:00 AM",
      type: "showing"
    },
    {
      id: 2,
      title: "Client Meeting",
      client: "Michael Chen",
      location: "Office",
      date: "2025-05-22",
      startTime: "2:00 PM",
      endTime: "3:00 PM",
      type: "meeting"
    },
    {
      id: 3,
      title: "Open House",
      client: "Public",
      location: "456 Oak Ave",
      date: "2025-05-23",
      startTime: "1:00 PM",
      endTime: "4:00 PM",
      type: "open-house"
    },
    {
      id: 4,
      title: "Follow-up Call",
      client: "Sarah Johnson",
      location: "Phone",
      date: "2025-05-24",
      startTime: "11:00 AM",
      endTime: "11:30 AM",
      type: "call"
    }
  ]);

  // Filter events for the selected date
  const filteredEvents = events.filter(event => event.date === selectedDate);
  
  // Create marked dates for the calendar
  const getMarkedDates = () => {
    const markedDates: any = {};
    
    events.forEach(event => {
      if (!markedDates[event.date]) {
        markedDates[event.date] = { marked: true, dotColor: theme.colors.primary };
      }
    });
    
    // Add selected date styling
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: theme.colors.primary,
    };
    
    return markedDates;
  };

  const getEventTypeStyles = (type: string) => {
    switch (type) {
      case 'showing':
        return {
          container: { backgroundColor: 'rgba(245, 124, 0, 0.1)', borderLeftColor: theme.colors.primary },
          icon: 'home'
        };
      case 'meeting':
        return {
          container: { backgroundColor: 'rgba(215, 204, 200, 0.1)', borderLeftColor: theme.colors.secondary },
          icon: 'people'
        };
      case 'open-house':
        return {
          container: { backgroundColor: 'rgba(191, 54, 12, 0.1)', borderLeftColor: theme.colors.accent },
          icon: 'business'
        };
      case 'call':
        return {
          container: { backgroundColor: 'rgba(62, 39, 35, 0.05)', borderLeftColor: theme.colors.text },
          icon: 'call'
        };
      default:
        return {
          container: { backgroundColor: 'rgba(158, 158, 158, 0.1)', borderLeftColor: theme.colors.grey },
          icon: 'calendar'
        };
    }
  };

  const renderEvent = ({ item }: { item: Event }) => {
    const eventStyles = getEventTypeStyles(item.type);
    
    return (
      <View style={[styles.eventItem, eventStyles.container]}>
        <View style={styles.eventTimeContainer}>
          <Text style={styles.eventTime}>{item.startTime}</Text>
          <Text style={styles.eventTimeSeparator}>-</Text>
          <Text style={styles.eventTime}>{item.endTime}</Text>
        </View>
        
        <View style={styles.eventContent}>
          <View style={styles.eventHeader}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Ionicons name={eventStyles.icon as any} size={20} color={theme.colors.text} />
          </View>
          <Text style={styles.eventLocation}>{item.location}</Text>
          <Text style={styles.eventClient}>{item.client}</Text>
        </View>
      </View>
    );
  };

  const formatSelectedDate = () => {
    const date = new Date(selectedDate);
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  return (
    <View style={styles.container}>
      <RNCalendar
        theme={{
          backgroundColor: '#FFFFFF',
          calendarBackground: '#FFFFFF',
          textSectionTitleColor: theme.colors.text,
          selectedDayBackgroundColor: theme.colors.primary,
          selectedDayTextColor: '#FFFFFF',
          todayTextColor: theme.colors.primary,
          dayTextColor: theme.colors.text,
          textDisabledColor: theme.colors.grey,
          dotColor: theme.colors.primary,
          selectedDotColor: '#FFFFFF',
          arrowColor: theme.colors.primary,
          monthTextColor: theme.colors.text,
          textMonthFontWeight: 'bold',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 14
        }}
        markedDates={getMarkedDates()}
        onDayPress={(day) => setSelectedDate(day.dateString)}
      />
      
      <View style={styles.eventsContainer}>
        <View style={styles.eventsHeader}>
          <Text style={styles.eventsDate}>{formatSelectedDate()}</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add Event</Text>
          </TouchableOpacity>
        </View>
        
        {filteredEvents.length > 0 ? (
          <FlatList
            data={filteredEvents}
            renderItem={renderEvent}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.eventsList}
          />
        ) : (
          <View style={styles.noEventsContainer}>
            <Ionicons name="calendar-outline" size={60} color={theme.colors.grey} />
            <Text style={styles.noEventsText}>No events scheduled</Text>
            <Text style={styles.noEventsSubText}>Tap the Add Event button to create one</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  eventsContainer: {
    flex: 1,
    padding: theme.spacing.md,
  },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  eventsDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.roundness,
  },
  addButtonText: {
    color: '#FFFFFF',
    marginLeft: 4,
    fontWeight: '500',
  },
  eventsList: {
    paddingBottom: theme.spacing.md,
  },
  eventItem: {
    flexDirection: 'row',
    borderRadius: theme.roundness,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    borderLeftWidth: 4,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventTimeContainer: {
    width: 80,
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventTime: {
    fontSize: 14,
    color: theme.colors.text,
  },
  eventTimeSeparator: {
    fontSize: 14,
    color: theme.colors.grey,
    marginVertical: 2,
  },
  eventContent: {
    flex: 1,
    padding: theme.spacing.md,
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.secondary,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
  eventLocation: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 4,
  },
  eventClient: {
    fontSize: 14,
    color: theme.colors.grey,
  },
  noEventsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noEventsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
  noEventsSubText: {
    color: theme.colors.grey,
    marginTop: theme.spacing.xs,
  },
});
