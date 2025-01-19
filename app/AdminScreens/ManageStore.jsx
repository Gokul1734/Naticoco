import { View, ScrollView, StyleSheet, Dimensions, Animated } from 'react-native';
import { Text, Card, FAB, Button, IconButton, ActivityIndicator } from 'react-native-paper';
import { useState, useRef, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const AnimatedStoreStats = ({ stores }) => {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: opacityAnim, transform: [{ scale: scaleAnim }] }}>
      <LinearGradient colors={['#20348f', '#20348f']} style={styles.statsCard}>
        <Card.Content style={styles.statsContent}>
          <View style={[styles.statItem, { transform: [{ scale: 1.05 }] }]}>
            <Text variant="headlineMedium" style={styles.statNumber}>{stores.length}</Text>
            <Text variant="labelLarge" style={styles.statLabel}>Total Stores</Text>
          </View>
          <View style={[styles.statItem, { transform: [{ scale: 1.05 }] }]}>
            <Text variant="headlineMedium" style={styles.statNumber}>4.5</Text>
            <Text variant="labelLarge" style={styles.statLabel}>Avg Rating</Text>
          </View>
        </Card.Content>
      </LinearGradient>
    </Animated.View>
  );
};

const StoreCard = ({ store, index, onPress }) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{
      transform: [{ translateX: slideAnim }],
      opacity: opacityAnim,
    }}>
      <LinearGradient colors={['#20348f', '#20348f']} style={styles.storeCard}>
        <Card mode='elevated' style={{backgroundColor: '#0f1c57'}} onPress={onPress}>
          <Card.Content>
            <View style={styles.storeHeader}>
              <View style={styles.headerContent}>
                <Text variant="titleLarge" style={styles.storeName}>
                  {store.name}
                </Text>
                <Text variant="bodyMedium" style={styles.storeEmail}>
                  {store.email}
                </Text>
              </View>
              <IconButton
                icon="pencil"
                size={24}
                iconColor='#20348f'
                onPress={onPress}
                style={styles.editButton}
              />
            </View>
            
            <View style={styles.storeDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="call" size={20} color='#f8931f' />
                <Text variant="bodyLarge" style={styles.detailText}>
                  {store.mobileno}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="star" size={20} color="#FFD700" />
                <Text variant="bodyLarge" style={styles.detailText}>4.5</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="location" size={20} color='#f8931f' />
                <Text variant="bodyLarge" style={styles.detailText}>
                  {store.cityName}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </LinearGradient>
    </Animated.View>
  );
};

const ManageStore = () => {
  const navigation = useNavigation();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('http://192.168.29.242:3500/Admin/cityowners');
      console.log('API Response:', response.data);

      if (response.data.cityOwners && Array.isArray(response.data.cityOwners)) {
        setStores(response.data.cityOwners);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (err) {
      console.error('Error fetching stores:', err);
      setError(err.response?.data?.message || 'Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
    const unsubscribe = navigation.addListener('focus', fetchStores);
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#20348f" />
        <Text style={styles.loadingText}>Loading stores...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button mode="contained" onPress={fetchStores} style={styles.retryButton}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#fff', '#fff']} style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {stores.length > 0 ? (
          <>
            <AnimatedStoreStats stores={stores} />
            {stores.map((store, index) => (
              <StoreCard
                key={store._id}
                store={store}
                index={index}
                onPress={() => navigation.navigate('EditStore', { store })}
              />
            ))}
          </>
        ) : (
          <View style={styles.noStoresContainer}>
            <Text style={styles.noStoresText}>No stores found</Text>
          </View>
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddStore')}
        animated={true}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  statsCard: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: 'white',
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'white',
    marginTop: 4,
  },
  storeCard: {
    margin: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#20348f',
  },
  storeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerContent: {
    flex: 1,
  },
  storeName: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 20,
    marginBottom: 4,
  },
  storeEmail: {
    color: '#f8931f',
    fontSize: 14,
  },
  storeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    marginLeft: 4,
    color: 'white',
    fontSize: 14,
  },
  editButton: {
    backgroundColor: '#fff5e6',
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    backgroundColor: '#20348f',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    color: '#20348f',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#20348f',
  },
  noStoresContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  noStoresText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
});

export default ManageStore;