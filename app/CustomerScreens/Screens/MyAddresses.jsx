import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView, KeyboardAvoidingView, Platform, Keyboard, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ScreenBackground from '../Components/ScreenBackground';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

// Mock data for addresses (replace with actual data from backend)
const initialAddresses = [
  {
    id: '1',
    type: 'Custom',
    tag: 'Home',
    address: '123 Main Street',
    area: 'Anna Nagar',
    city: 'Chennai',
    pincode: '600001',
    isDefault: true,
  },
  {
    id: '2',
    type: 'Custom',
    tag: 'Office',
    address: '456 Office Complex',
    area: 'T Nagar',
    city: 'Chennai',
    pincode: '600017',
    isDefault: false,
  },
];

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function MyAddresses() {
  const navigation = useNavigation();
  const [addresses, setAddresses] = useState(initialAddresses);
  const [modalVisible, setModalVisible] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: 'Custom',
    tag: '',
    address: '',
    area: '',
    city: 'Chennai',
    pincode: '',
  });

  const handleAddAddress = () => {
    if (!newAddress.tag || !newAddress.address || !newAddress.area || !newAddress.pincode) {
      alert('Please fill in all fields');
      return;
    }

    const address = {
      id: new Date().getTime().toString(),
      ...newAddress,
      isDefault: addresses.length === 0,
    };

    setAddresses([...addresses, address]);
    setModalVisible(false);
    setNewAddress({
      type: 'Custom',
      tag: '',
      address: '',
      area: '',
      city: 'Chennai',
      pincode: '',
    });
  };

  const handleSetDefault = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const AddressCard = ({ address }) => (
    <View style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <View style={styles.typeContainer}>
          <Ionicons 
            name="location-outline"
            size={20} 
            color="#F8931F" 
          />
          <Text style={styles.addressType}>{address.tag}</Text>
        </View>
        {address.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultText}>Default</Text>
          </View>
        )}
      </View>

      <Text style={styles.addressText}>{address.address}</Text>
      <Text style={styles.addressText}>{address.area}</Text>
      <Text style={styles.addressText}>{address.city} - {address.pincode}</Text>

      <View style={styles.actionRow}>
        {!address.isDefault && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleSetDefault(address.id)}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#F8931F" />
            <Text style={styles.actionButtonText}>Set as Default</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleDeleteAddress(address.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#F8931F" />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenBackground style={styles.container}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Addresses</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Ionicons name="add-circle-outline" size={24} color="#F8931F" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={addresses}
          renderItem={({ item }) => <AddressCard address={item} />}
          keyExtractor={item => item._id || item.id}
          contentContainerStyle={styles.addressList}
          showsVerticalScrollIndicator={false}
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalWrapper}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Add New Address</Text>
                  <TouchableOpacity 
                    onPress={() => {
                      Keyboard.dismiss();
                      setModalVisible(false);
                    }}
                  >
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                </View>

                <ScrollView 
                  style={styles.modalScroll}
                  keyboardShouldPersistTaps="handled"
                >
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Address Tag</Text>
                    <TextInput
                      style={styles.input}
                      value={newAddress.tag}
                      onChangeText={(text) => setNewAddress({...newAddress, tag: text})}
                      placeholder="e.g., Home, Office, Mom's House"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Complete Address</Text>
                    <TextInput
                      style={styles.input}
                      value={newAddress.address}
                      onChangeText={(text) => setNewAddress({...newAddress, address: text})}
                      placeholder="House/Flat No., Building Name"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Area</Text>
                    <TextInput
                      style={styles.input}
                      value={newAddress.area}
                      onChangeText={(text) => setNewAddress({...newAddress, area: text})}
                      placeholder="Street Name, Area"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Pincode</Text>
                    <TextInput
                      style={styles.input}
                      value={newAddress.pincode}
                      onChangeText={(text) => setNewAddress({...newAddress, pincode: text})}
                      placeholder="6-digit Pincode"
                      keyboardType="numeric"
                      maxLength={6}
                    />
                  </View>
                </ScrollView>

                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={() => {
                    handleAddAddress();
                    Keyboard.dismiss();
                  }}
                >
                  <Text style={styles.saveButtonText}>Save Address</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8931F',
  },
  addressList: {
    padding: 16,
  },
  addressCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressType: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textTransform: 'capitalize',
  },
  defaultBadge: {
    backgroundColor: '#89C73A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  actionButtonText: {
    marginLeft: 4,
    color: '#F8931F',
    fontSize: 14,
  },
  modalWrapper: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 30,
    maxHeight: SCREEN_HEIGHT * 0.8,
  },
  modalScroll: {
    maxHeight: SCREEN_HEIGHT * 0.6,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 5,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  saveButton: {
    backgroundColor: '#F8931F',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 