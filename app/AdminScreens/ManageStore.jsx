import { View, ScrollView, StyleSheet, Dimensions, Animated } from 'react-native';
import { Text, Card, FAB, TextInput, Button, Portal, Modal, IconButton, MD3Colors } from 'react-native-paper';
import { useState, useRef, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import storeData from '../../Backend/Store.json';
import { useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
      <LinearGradient
        colors={['#20348f', '#20348f']}
        style={styles.statsCard}
      >
        <Card.Content style={styles.statsContent}>
          <View style={[styles.statItem, { transform: [{ scale: 1.05 }] }]}>
            <Text variant="headlineMedium" style={styles.statNumber}>
              {stores.length}
            </Text>
            <Text variant="labelLarge" style={styles.statLabel}>Total Stores</Text>
          </View>
          <View style={[styles.statItem, { transform: [{ scale: 1.05 }] }]}>
            <Text variant="headlineMedium" style={styles.statNumber}>
              {(stores.reduce((acc, store) => acc + store.rating, 0) / stores.length).toFixed(1)}
            </Text>
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
    <Animated.View
      style={{
        transform: [{ translateX: slideAnim }],
        opacity: opacityAnim,
      }}
    >
      <LinearGradient
        colors={['#20348f', '#20348f']}
        style={[styles.storeCard, { elevation: 4 }]}
      >
        <Card mode='elevated' style={{backgroundColor:'#0f1c57'}} onPress={onPress}>
          <Card.Content>
            <View style={styles.storeHeader}>
              <View>
                <Text variant="titleLarge" style={styles.areaText}>
                  {store.Area}, {store.City}
                </Text>
                <Text variant="bodyMedium" style={styles.address}>
                  {store.address}
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
                <Text variant="bodyLarge" style={styles.detailText}>{store.phone}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="star" size={20} color="#FFD700" />
                <Text variant="bodyLarge" style={styles.detailText}>{store.rating}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="cube" size={20} color='#f8931f' />
                <Text variant="bodyLarge" style={styles.detailText}>
                  {store.stocks.reduce((sum, item) => sum + item.quantity, 0)} items
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </LinearGradient>
    </Animated.View>
  );
};

export default function ManageStore({ navigation, route }) {
    const [stores, setStores] = useState(storeData);
    const [newStore, setNewStore] = useState({
        name: '',
        Area: '',
        City: '',
        address: '',
        phone: '',
    });

    useEffect(() => {
        loadStores();
    }, []);

    useEffect(() => {
        if (route.params?.newStore) {
            setStores(prevStores => [...prevStores, route.params.newStore]);
        }
    }, [route.params?.newStore]);

    const loadStores = async () => {
        try {
            const savedStores = await AsyncStorage.getItem('stores');
            if (savedStores) {
                setStores(JSON.parse(savedStores));
            }
        } catch (error) {
            console.error('Error loading stores:', error);
        }
    };

    const addStore = () => {
        if (newStore.name && newStore.address && newStore.phone) {
            setStores([...stores, {
                id: stores.length + 1,
                ...newStore,
                rating: 0,
                stocks: []
            }]);
            setNewStore({ name: '', Area: '', City: '', address: '', phone: '' });
            setVisible(false);
        }
    };

    return (
        <LinearGradient
            colors={['#fff', '#ffff']}
            style={styles.container}
        >
            <ScrollView showsVerticalScrollIndicator={false}>
                <AnimatedStoreStats stores={stores} />

                {stores.map((store, index) => (
                    <StoreCard
                        key={store.id}
                        store={store}
                        index={index}
                        onPress={() => {/* Handle edit */}}
                    />
                ))}
            </ScrollView>

            <FAB
                icon="plus"
                style={[styles.fab, { transform: [{ scale: 1.1 }], backgroundColor: '#20348f' }]}
                onPress={() => navigation.navigate('AddStore')}
                animated={true}
            />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
     flex:1,
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
        backgroundColor:'#20348f'
    },
    storeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    areaText: {
        color: 'white',
        fontWeight: 'bold',
        color:'white'
    },
    address: {
        opacity: 0.7,
        marginTop: 4,
        color:'white'
    },
    storeDetails: {
        flexDirection: 'row',
        marginTop: 16,
        justifyContent: 'space-around',
        color:'white'
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    detailText: {
        marginLeft: 4,
        color: 'white',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 20,
        bottom: 80,
        backgroundColor: '#0f1c57'
    },
    modal: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 12,
    },
    modalTitle: {
        marginBottom: 20,
        textAlign: 'center',
        color: '#0f1c57'
    },
    input: {
        marginBottom: 12,
        backgroundColor: '#fff',
    },
    addButton: {
        bottom:200,
        backgroundColor:'#20348f'
    },
    editButton: {
        backgroundColor: '#fff5e6',
    },
});
