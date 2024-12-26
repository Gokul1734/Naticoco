import { View, ScrollView, StyleSheet, Dimensions, FlatList } from 'react-native';
import { Text, Searchbar, Card, Avatar, Chip, IconButton, ActivityIndicator } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const UserStatsCard = ({ totalUsers, activeUsers, newUsers }) => (
  <MotiView
    from={{ opacity: 0, translateY: 50 }}
    animate={{ opacity: 1, translateY: 0 }}
    transition={{ type: 'spring', delay: 100 }}
  >
    <LinearGradient
      colors={['#fff', '#fff5e6']}
      style={styles.statsCard}
    >
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalUsers}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{activeUsers}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{newUsers}</Text>
          <Text style={styles.statLabel}>New Today</Text>
        </View>
      </View>
    </LinearGradient>
  </MotiView>
);

const UserCard = ({ user, index }) => (
  <MotiView
    from={{ opacity: 0, translateX: -100 }}
    animate={{ opacity: 1, translateX: 0 }}
    transition={{ type: 'spring', delay: index * 100 }}
  >
    <Card style={styles.userCard}>
      <Card.Content>
        <View style={styles.userHeader}>
          <View style={styles.userInfo}>
            <Avatar.Text 
              size={50} 
              label={user.name.split(' ').map(n => n[0]).join('')} 
              style={styles.avatar}
              color='white'
              backgroundColor='#F8931F'
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.userMetrics}>
          <View style={styles.metric}>
            <Ionicons name="cart" size={20} color="#F8931F" />
            <Text style={styles.metricText}>{2} Orders</Text>
          </View>
          <View style={styles.metric}>
            <Ionicons name="location" size={20} color="#F8931F" />
            <Text style={styles.metricText}>{3} Addresses</Text>
          </View>
          <View style={styles.metric}>
            <Ionicons name="star" size={20} color="#F8931F" />
            <Text style={styles.metricText}>{(user.rating)?user.rating:"0"}/5</Text>
          </View>
        </View>

        <View style={styles.tagContainer}>
          {user.isActive && (
            <Chip 
              style={[styles.chip, { backgroundColor: '#E8F5E9' }]}
              textStyle={{ color: '#2E7D32' }}
            >
              Active
            </Chip>
          )}
          {user.isPremium && (
            <Chip 
              style={[styles.chip, { backgroundColor: '#FFF3E0' }]}
              textStyle={{ color: '#F8931F' }}
            >
              Premium
            </Chip>
          )}
        </View>
      </Card.Content>
    </Card>
  </MotiView>
);

export default function ManageUser() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const existingUsers = await axios.get('http://192.168.29.165:3500/auth/Users');
        setUsers(existingUsers.data);
        setFilteredUsers(existingUsers.data); // Initialize filtered users with all users
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredUsers(users); // Show all users when search is empty
      return;
    }

    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase()) ||
      user.userId.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  return (
    <LinearGradient
      colors={['#fff', '#fff5e6']}
      style={styles.container}
    >
      <MotiView
        from={{ opacity: 0, translateY: -50 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring' }}
      >
        <Searchbar
          placeholder="Search by name, email or ID..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
          iconColor="#F8931F"
          theme={{ colors: { primary: '#F8931F' } }}
        />
      </MotiView>

      <UserStatsCard
        totalUsers={users.length}
        activeUsers={users.filter(u => u.isActive).length}
        newUsers={users.filter(u => {
          const today = new Date();
          const userDate = new Date(u.createdAt);
          return today.toDateString() === userDate.toDateString();
        }).length}
      />

      {loading ? (
        <ActivityIndicator style={styles.loader} color="#F8931F" size="large" />
      ) : filteredUsers.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Ionicons name="search" size={50} color="#F8931F" />
          <Text style={styles.noResultsText}>No users found</Text>
          <Text style={styles.noResultsSubText}>Try a different search term</Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={({ item, index }) => <UserCard user={item} index={index} />}
          keyExtractor={item => item.userId}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    elevation: 4,
    marginHorizontal: 10,
  },
  statsCard: {
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F8931F',
  },
  statLabel: {
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#ddd',
  },
  userCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: 'white',
    marginHorizontal: 10,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    color: '#666',
    fontSize: 14,
  },
  userMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricText: {
    marginLeft: 4,
    color: '#666',
  },
  tagContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  chip: {
    borderRadius: 12,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 16,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  noResultsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  noResultsSubText: {
    fontSize: 16,
    color: '#999',
    marginTop: 8,
  },
});
