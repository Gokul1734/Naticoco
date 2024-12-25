import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.canceled) {
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
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => navigation.navigate('Login'),
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={localStyles.container}>
      <View style={localStyles.profileContainer}>
        <TouchableOpacity onPress={pickImage} style={localStyles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={localStyles.profileImage} />
          ) : (
            <View style={localStyles.placeholderImage}>
              <Text style={localStyles.placeholderText}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={localStyles.username}>User Name</Text>
        <Text style={localStyles.email}>abc@example.com</Text>

        <View style={localStyles.infoContainer}>
          <View style={localStyles.infoItem}>
            <Text style={localStyles.infoLabel}>Chennai</Text>
            <Text style={localStyles.infoValue}>Tamil Nadu, India</Text>
          </View>
          <View style={localStyles.infoItem}>
            <Text style={localStyles.infoLabel}>Member Since</Text>
            <Text style={localStyles.infoValue}>December 2024</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={localStyles.menuButton}
          onPress={() => navigation.navigate('MyOrders')}
        >
          <Ionicons name="receipt-outline" size={24} color="#F8931F" />
          <Text style={localStyles.menuButtonText}>My Orders</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={localStyles.menuButton}
          onPress={() => navigation.navigate('MyAddresses')}
        >
          <Ionicons name="location-outline" size={24} color="#F8931F" />
          <Text style={localStyles.menuButtonText}>My Addresses</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={localStyles.logoutButton} 
          onPress={handleLogout}
        >
          <Text style={localStyles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  profileContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  imageContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  placeholderImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
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
    width: '100%',
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginBottom: 20,
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
  logoutButton: {
    backgroundColor: '#F8931F',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuButtonText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
});
