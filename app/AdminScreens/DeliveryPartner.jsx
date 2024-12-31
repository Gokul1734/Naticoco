import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Animated } from 'react-native';
import { Text, Card, Avatar, Button, Chip, IconButton, Searchbar } from 'react-native-paper';
import { MotiView, AnimatePresence } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from '../utils/responsive';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { Platform } from 'react-native';
import { State } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const mockDeliveryPartners = [
  {
    id: 'DP001',
    name: 'John Doe',
    status: 'PENDING',
    rating: 4.5,
    totalDeliveries: 150,
    vehicleType: 'Bike',
    phone: '+91 9876543210',
    documents: {
      license: true,
      insurance: true,
      registration: false
    },
    location: 'Hyderabad Central',
    joinDate: '2024-02-15'
  },
  // Add more mock data...
];

const DeliveryPartnerCard = ({ partner, onApprove, onReject, onSuspend }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const translateX = new Animated.Value(0);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      if (nativeEvent.translationX < -100) {
        onReject(partner.id);
      } else if (nativeEvent.translationX > 100) {
        onApprove(partner.id);
      }
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', duration: 500 }}
      style={styles.cardContainer}
    >
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        enabled={partner.status === 'PENDING'}
      >
        <Animated.View style={[
          styles.cardWrapper,
          { transform: [{ translateX }] }
        ]}>
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <View style={styles.userInfo}>
                  <Avatar.Text
                    size={50}
                    label={partner.name.split(' ').map(n => n[0]).join('')}
                    style={styles.avatar}
                    color='white'
                    backgroundColor='#0f1c57'
                  />
                  <View style={styles.nameContainer}>
                    <Text style={styles.name}>{partner.name}</Text>
                    <Chip
                      style={[
                        styles.statusChip,
                        { backgroundColor: getStatusColor(partner.status) }
                      ]}
                    >
                      {partner.status}
                    </Chip>
                  </View>
                </View>
                <IconButton
                  icon={isExpanded ? 'chevron-up' : 'chevron-down'}
                  onPress={() => setIsExpanded(!isExpanded)}
                />
              </View>

              <MotiView
                animate={{ height: isExpanded ? 'auto' : 0 }}
                transition={{ type: 'timing', duration: 300 }}
                style={styles.expandedContent}
              >
                <View style={styles.statsGrid}>
                  <StatItem
                    icon="bicycle"
                    label="Vehicle"
                    value={partner.vehicleType}
                  />
                  <StatItem
                    icon="star"
                    label="Rating"
                    value={partner.rating.toFixed(1)}
                  />
                  <StatItem
                    icon="bicycle"
                    label="Deliveries"
                    value={partner.totalDeliveries}
                  />
                </View>

                <View style={styles.documentsSection}>
                  <Text style={styles.sectionTitle}>Documents</Text>
                  <View style={styles.documentsList}>
                    <DocumentItem
                      label="License"
                      verified={partner.documents.license}
                    />
                    <DocumentItem
                      label="Insurance"
                      verified={partner.documents.insurance}
                    />
                    <DocumentItem
                      label="Registration"
                      verified={partner.documents.registration}
                    />
                  </View>
                </View>

                {partner.status === 'PENDING' && (
                  <View style={styles.actionButtons}>
                    <Button
                      mode="contained"
                      onPress={() => onApprove(partner.id)}
                      style={[styles.button, styles.approveButton]}
                    >
                      Approve
                    </Button>
                    <Button
                      mode="outlined"
                      onPress={() => onReject(partner.id)}
                      style={[styles.button, styles.rejectButton]}
                    >
                      Reject
                    </Button>
                  </View>
                )}

                {partner.status === 'ACTIVE' && (
                  <Button
                    mode="contained"
                    onPress={() => onSuspend(partner.id)}
                    style={[styles.button, styles.suspendButton]}
                  >
                    Suspend Partner
                  </Button>
                )}
              </MotiView>
            </Card.Content>
          </Card>
        </Animated.View>
      </PanGestureHandler>
    </MotiView>
  );
};

const StatItem = ({ icon, label, value }) => (
  <View style={styles.statItem}>
    <Ionicons name={icon} size={24} color="#0f1c57" />
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const DocumentItem = ({ label, verified }) => (
  <View style={styles.documentItem}>
    <Ionicons
      name={verified ? 'checkmark-circle' : 'close-circle'}
      size={24}
      color={verified ? '#4CAF50' : '#F44336'}
    />
    <Text style={styles.documentLabel}>{label}</Text>
  </View>
);

export default function DeliveryPartner() {
  const [partners, setPartners] = useState(mockDeliveryPartners);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const handleApprove = (id) => {
    setPartners(partners.map(p => 
      p.id === id ? { ...p, status: 'ACTIVE' } : p
    ));
  };

  const handleReject = (id) => {
    setPartners(partners.map(p => 
      p.id === id ? { ...p, status: 'REJECTED' } : p
    ));
  };

  const handleSuspend = (id) => {
    setPartners(partners.map(p => 
      p.id === id ? { ...p, status: 'SUSPENDED' } : p
    ));
  };

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'ALL' || partner.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Delivery Partners</Text>
        <Searchbar
          placeholder="Search partners..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchBar}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          {['ALL', 'PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED'].map((filter) => (
            <Chip
              key={filter}
              selected={selectedFilter === filter}
              onPress={() => setSelectedFilter(filter)}
              style={[
                styles.filterChip,
                selectedFilter === filter && styles.selectedChip
              ]}
            >
              {filter}
            </Chip>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content}>
        <AnimatePresence>
          {filteredPartners.map((partner, index) => (
            <DeliveryPartnerCard
              key={partner.id}
              partner={partner}
              onApprove={handleApprove}
              onReject={handleReject}
              onSuspend={handleSuspend}
            />
          ))}
        </AnimatePresence>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: scale(20),
    backgroundColor: '#0f1c57',
  },
  headerTitle: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: 'white',
    marginBottom: verticalScale(15),
  },
  searchBar: {
    marginBottom: scale(15),
    borderRadius: scale(10),
    backgroundColor: 'white',
  },
  filterContainer: {
    marginBottom: scale(10),
  },
  filterChip: {
    marginRight: scale(10),
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  selectedChip: {
    backgroundColor: '#F8931F',
  },
  content: {
    flex: 1,
    padding: scale(15),
  },
  cardContainer: {
    marginBottom: scale(15),
  },
  cardWrapper: {
    borderRadius: scale(12),
    backgroundColor: '#f5f5f5',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  card: {
    borderRadius: scale(12),
    backgroundColor: '#f5f5f5',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: scale(15),
  },
  nameContainer: {
    gap: scale(5),
  },
  name: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#0f1c57',
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  expandedContent: {
    overflow: 'hidden',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: verticalScale(15),
    paddingVertical: verticalScale(10),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: moderateScale(12),
    color: '#424242',
    marginTop: verticalScale(5),
  },
  statValue: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: '#0f1c57',
  },
  documentsSection: {
    marginTop: verticalScale(15),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: '#0f1c57',
    marginBottom: verticalScale(10),
  },
  documentsList: {
    gap: scale(10),
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
  },
  documentLabel: {
    fontSize: moderateScale(14),
    color: '#424242',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: verticalScale(15),
    gap: scale(10),
  },
  button: {
    flex: 1,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    borderColor: '#F44336',
  },
  suspendButton: {
    backgroundColor: '#FF9800',
    marginTop: verticalScale(15),
  },
});

const getStatusColor = (status) => {
  switch (status) {
    case 'ACTIVE':
      return '#E8F5E9';
    case 'PENDING':
      return '#FFF3E0';
    case 'SUSPENDED':
      return '#FFE0B2';
    case 'REJECTED':
      return '#FFEBEE';
    default:
      return '#E0E0E0';
  }
};
