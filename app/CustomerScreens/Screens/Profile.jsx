import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Alert,
  Animated,
  Dimensions,
  Platform,
  ImageBackground,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState, useRef, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import ScreenBackground from '../Components/ScreenBackground';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);

  // Sample user data
  const sampleUser = {
    name: 'Gokulpriyan Karthikeyan',
    email: 'kgokulpriyan@gmail.com',
    location: {
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India'
    },
    memberSince: 'December 2024'
  };

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const menuItemsAnim = useRef([...Array(3)].map(() => new Animated.Value(SCREEN_WIDTH))).current;

  useEffect(() => {
    // Animate profile section
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate menu items sequentially
    menuItemsAnim.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
        delay: index * 100,
      }).start();
    });
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.canceled) {
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
        ]).start();
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: () => {
            Animated.parallel([
              Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.timing(slideAnim, {
                toValue: 50,
                duration: 300,
                useNativeDriver: true,
              }),
            ]).start(() => {
              navigation.replace('Login');
            });
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ImageBackground source={require('../../../assets/images/profileBackdrop.png')} resizeMode='cover' style={styles.container}>
        <Animated.View 
          style={[
            styles.profileContainer,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ],
            },
          ]}
        >
          <View style={styles.profilebackdrop}></View>
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            {image ? (
              <Image source={{ uri: image }} style={styles.profileImage} />
            ) : (
              <LinearGradient
                colors={['#fff5e6', '#ffffff']}
                style={styles.placeholderImage}
              >
                <Ionicons name="person" size={50} color="#F8931F" />
              </LinearGradient>
            )}
            <View style={styles.editBadge}>
              <Ionicons name="camera" size={16} color="white" />
            </View>
          </TouchableOpacity>

          <Text style={styles.username}>{sampleUser.name}</Text>
          <Text style={styles.email}>{sampleUser.email}</Text>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>{sampleUser.location.city}</Text>
              <Text style={styles.infoValue}>
                {`${sampleUser.location.state}, ${sampleUser.location.country}`}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>{sampleUser.memberSince}</Text>
            </View>
          </View>

          {['MyOrders', 'MyAddresses'].map((route, index) => (
            <Animated.View
              key={route}
              style={{
                width: '100%',
                transform: [{ translateX: menuItemsAnim[index] }],
              }}
            >
              <TouchableOpacity 
                style={styles.menuButton}
                onPress={() => navigation.navigate(route)}
              >
                <Ionicons 
                  name={route === 'MyOrders' ? 'receipt-outline' : 'location-outline'} 
                  size={24} 
                  color="#F8931F" 
                />
                <Text style={styles.menuButtonText}>
                  {route === 'MyOrders' ? 'My Orders' : 'My Addresses'}
                </Text>
                <Ionicons name="chevron-forward" size={24} color="#666" />
              </TouchableOpacity>
            </Animated.View>
          ))}

          <View style={styles.logoutContainer}>
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
          >
            <LinearGradient
              colors={['#F8931F', '#f4a543']}
              style={styles.logoutGradient}
            >
              <Ionicons name="log-out-outline" size={24} color="white" />
              <Text style={styles.logoutText}>Logout</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={() => console.log('Support')}
          >
            <LinearGradient
              colors={['#F8931F', '#f4a543']}
              style={styles.logoutGradient}
            >
              <Ionicons name="call-outline" size={24} color="white" />
              <Text style={styles.logoutText}>Support</Text>
            </LinearGradient>
          </TouchableOpacity>
          </View>
        </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    margin: 0,
    backgroundColor: '#e59f50',
  },
  profileContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  imageContainer: {
    marginTop: 20,
    marginBottom: 20,
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 75,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#F8931F',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  infoContainer: {
    marginTop: 80,
    width: '100%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 40,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  infoItem: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  menuButtonText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    overflow: 'hidden',
    borderRadius: 25,
    marginTop: 20,
    width: '40%',
    maxWidth: 200,
    height: 50,
  },
  logoutGradient: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent:'center',
    width:'100%',
    height:'100%',
    flexDirection:'row',
    gap:10,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutContainer: {
    // flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'white',
    flexDirection:'row',
    gap:30,
  },
  profilebackdrop: {
    height: 600,
    width: 800,
    position: 'absolute',
    top: 250,
    left: -200,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    borderTopWidth: 15,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderColor: '#F8931F',
    borderTopLeftRadius: '48%',
    borderTopRightRadius: '48%',
  },
});
