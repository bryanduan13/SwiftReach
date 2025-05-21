
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { theme } from '../components/ThemeConfig';
import { clientsApi } from '../lib/api';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  status: string | null;
  created_at: string;
}

export default function ClientsScreen() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const navigation = useNavigation();

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    filterClients();
  }, [searchQuery, statusFilter, clients]);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const response = await clientsApi.getClients();
      setClients(response.data);
      setFilteredClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      // Use mock data if API call fails
      const mockClients = [
        { 
          id: '1', 
          first_name: 'Emma',
          last_name: 'Thompson',
          email: 'emma@example.com',
          phone: '(555) 123-4567',
          status: 'active',
          created_at: new Date().toISOString()
        },
        { 
          id: '2', 
          first_name: 'Michael',
          last_name: 'Chen',
          email: 'michael@example.com',
          phone: '(555) 234-5678',
          status: 'lead',
          created_at: new Date().toISOString()
        },
        { 
          id: '3', 
          first_name: 'Sarah',
          last_name: 'Johnson',
          email: 'sarah@example.com',
          phone: '(555) 345-6789',
          status: 'qualified',
          created_at: new Date().toISOString()
        },
        { 
          id: '4', 
          first_name: 'David',
          last_name: 'Rodriguez',
          email: 'david@example.com',
          phone: '(555) 456-7890',
          status: 'active',
          created_at: new Date().toISOString()
        },
      ];
      setClients(mockClients);
      setFilteredClients(mockClients);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const filterClients = () => {
    let filtered = [...clients];
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(client => client.status === statusFilter);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(client => 
        `${client.first_name} ${client.last_name}`.toLowerCase().includes(query) ||
        client.email?.toLowerCase().includes(query) ||
        client.phone?.includes(query)
      );
    }
    
    setFilteredClients(filtered);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchClients();
  };

  const navigateToClientDetail = (client: Client) => {
    navigation.navigate('ClientDetail' as never, { client } as never);
  };

  const getStatusBadgeStyles = (status: string | null) => {
    switch(status) {
      case 'active':
        return styles.activeBadge;
      case 'lead':
        return styles.leadBadge;
      case 'qualified':
        return styles.qualifiedBadge;
      default:
        return styles.defaultBadge;
    }
  };

  const getStatusTextStyles = (status: string | null) => {
    switch(status) {
      case 'active':
        return styles.activeText;
      case 'lead':
        return styles.leadText;
      case 'qualified':
        return styles.qualifiedText;
      default:
        return styles.defaultText;
    }
  };

  const renderClient = ({ item }: { item: Client }) => (
    <TouchableOpacity 
      style={styles.clientCard}
      onPress={() => navigateToClientDetail(item)}
    >
      <View style={styles.clientInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.first_name.charAt(0)}{item.last_name.charAt(0)}
          </Text>
        </View>
        <View style={styles.clientDetails}>
          <Text style={styles.clientName}>{`${item.first_name} ${item.last_name}`}</Text>
          {item.email && <Text style={styles.clientContact}>{item.email}</Text>}
          {item.phone && <Text style={styles.clientContact}>{item.phone}</Text>}
        </View>
      </View>
      <View style={styles.clientActions}>
        <View style={[styles.badge, getStatusBadgeStyles(item.status)]}>
          <Text style={[styles.badgeText, getStatusTextStyles(item.status)]}>
            {item.status || 'Unknown'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.grey} />
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
            placeholder="Search clients..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={theme.colors.grey} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <TouchableOpacity 
            style={[styles.filterButton, statusFilter === 'all' ? styles.activeFilter : null]}
            onPress={() => setStatusFilter('all')}
          >
            <Text style={[styles.filterText, statusFilter === 'all' ? styles.activeFilterText : null]}>All</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, statusFilter === 'active' ? styles.activeFilter : null]}
            onPress={() => setStatusFilter('active')}
          >
            <Text style={[styles.filterText, statusFilter === 'active' ? styles.activeFilterText : null]}>Active</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, statusFilter === 'lead' ? styles.activeFilter : null]}
            onPress={() => setStatusFilter('lead')}
          >
            <Text style={[styles.filterText, statusFilter === 'lead' ? styles.activeFilterText : null]}>Lead</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, statusFilter === 'qualified' ? styles.activeFilter : null]}
            onPress={() => setStatusFilter('qualified')}
          >
            <Text style={[styles.filterText, statusFilter === 'qualified' ? styles.activeFilterText : null]}>Qualified</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {isLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : filteredClients.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={60} color={theme.colors.grey} />
          <Text style={styles.emptyText}>No clients found</Text>
          <Text style={styles.emptySubText}>Try a different search or filter</Text>
        </View>
      ) : (
        <FlatList
          data={filteredClients}
          renderItem={renderClient}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.clientsList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}

      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={24} color="#FFFFFF" />
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
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: theme.roundness,
    paddingHorizontal: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 46,
    color: theme.colors.text,
  },
  filterContainer: {
    marginBottom: theme.spacing.sm,
  },
  filterScroll: {
    paddingHorizontal: theme.spacing.md,
  },
  filterButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 20,
    marginRight: theme.spacing.sm,
    backgroundColor: '#FFFFFF',
  },
  activeFilter: {
    backgroundColor: theme.colors.primary,
  },
  filterText: {
    color: theme.colors.text,
  },
  activeFilterText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  clientsList: {
    padding: theme.spacing.md,
  },
  clientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.roundness,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
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
  clientDetails: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
  clientContact: {
    fontSize: 14,
    color: theme.colors.grey,
    marginTop: 2,
  },
  clientActions: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: theme.spacing.xs,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  activeBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  leadBadge: {
    backgroundColor: 'rgba(245, 124, 0, 0.1)',
  },
  qualifiedBadge: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
  },
  defaultBadge: {
    backgroundColor: 'rgba(158, 158, 158, 0.1)',
  },
  activeText: {
    color: '#4CAF50',
  },
  leadText: {
    color: theme.colors.primary,
  },
  qualifiedText: {
    color: '#2196F3',
  },
  defaultText: {
    color: theme.colors.grey,
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
