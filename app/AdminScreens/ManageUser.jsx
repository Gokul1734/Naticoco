// UserManagement.js
import { View, StyleSheet, Dimensions, FlatList } from 'react-native';
import { Text, Searchbar, Card, Avatar, Chip, ActivityIndicator } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const UserStatsCard = ({ totalUsers, verifiedUsers }) => (
  <MotiView
    from={{ opacity: 0, translateY: 50 }}
    animate={{ opacity: 1, translateY: 0 }}
    transition={{ type: 'spring', delay: 100 }}
  >
    <LinearGradient colors={['#fff', '#fff']} style={styles.statsCard}>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalUsers}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{verifiedUsers}</Text>
          <Text style={styles.statLabel}>Verified</Text>
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
              label={user.name ? user.name.split(' ').map(n => n[0]).join('') : '?'} 
              style={styles.avatar}
              color='#0f1c57'
              backgroundColor='white'
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.userMetrics}>
          <View style={styles.metric}>
            <Ionicons name="call" size={20} color="white" />
            <Text style={styles.metricText}>{user.mobileno}</Text>
          </View>
          <View style={styles.metric}>
            <Ionicons name="checkmark-circle" size={20} color="white" />
            <Text style={styles.metricText}>
              {user.verified ? 'Verified' : 'Unverified'}
            </Text>
          </View>
        </View>

        <View style={styles.tagContainer}>
          {user.verified && (
            <Chip 
              style={[styles.chip, { backgroundColor: '#E8F5E9' }]}
              textStyle={{ color: '#2E7D32' }}
            >
              Verified
            </Chip>
          )}
        </View>
      </Card.Content>
    </Card>
  </MotiView>
);

const ManageUser = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://192.168.83.227:3500/auth/users');
        const usersData = response.data.users || [];
        console.log('Users data:', usersData);
        setUsers(usersData);
        setFilteredUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
        setFilteredUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!users || !Array.isArray(users)) return;

    const filtered = users.filter(user => {
      const searchLower = query.toLowerCase();
      return (
        user?.name?.toLowerCase().includes(searchLower) ||
        user?.email?.toLowerCase().includes(searchLower) ||
        user?.mobileno?.toString().includes(searchLower)
      );
    });
    setFilteredUsers(filtered);
  };

  return (
    <LinearGradient colors={['#fff', '#fff']} style={styles.container}>
      <Searchbar
        placeholder="Search users..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
        iconColor="#0f1c57"
      />

      <UserStatsCard
        totalUsers={Array.isArray(users) ? users.length : 0}
        verifiedUsers={Array.isArray(users) ? users.filter(u => u?.verified).length : 0}
      />

      {loading ? (
        <ActivityIndicator style={styles.loader} color="#F8931F" size="large" />
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={({ item, index }) => <UserCard user={item} index={index} />}
          keyExtractor={item => item._id?.toString() || index.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No users found</Text>
            </View>
          }
        />
      )}
    </LinearGradient>
  );
};

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
    borderColor: '#0f1c57',
    borderWidth: 3
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
    color: '#0f1c57',
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
    backgroundColor: '#0f1c57',
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
    color: 'white',
  },
  userEmail: {
    color: '#ccc',
    fontSize: 14,
  },
  userMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#223670',
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricText: {
    color: 'white',
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
    fontSize: 18,
    color: '#666',
  },
});

export default ManageUser;