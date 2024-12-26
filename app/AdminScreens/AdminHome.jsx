import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Surface, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminHome({ navigation }) {
  const adminFeatures = [
    {
      title: 'Manage Stores',
      icon: 'store',
      description: 'Add and manage chicken stores',
      route: 'ManageStore',
      iconName: 'business'
    },
    {
      title: 'User Management',
      icon: 'account-search',
      description: 'Search and view user details',
      route: 'UserManagement',
      iconName: 'people'
    },
    {
      title: 'Order Analytics',
      icon: 'chart-bar',
      description: 'View and track store orders',
      route: 'OrderAnalytics',
      iconName: 'stats-chart'
    },
    {
      title: 'Delivery Partners',
      icon: 'bike',
      description: 'Manage delivery partner details',
      route: 'DeliveryPartners',
      iconName: 'bicycle'
    }
  ];

  return (
    <LinearGradient
      colors={['#fff', '#fff5e6']}
      style={styles.container}
    >
      <ScrollView style={styles.container}>
        <MotiView
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 1000 }}
        >
          <Surface style={styles.header} elevation={2}>
            <LinearGradient
              colors={['#F8931F', '#f4a543']}
              style={styles.headerGradient}
            >
              <Text variant="headlineMedium" style={styles.headerText}>
                Admin Dashboard
              </Text>
            </LinearGradient>
          </Surface>
        </MotiView>
        <View style={[{flexDirection:'row',justifyContent:'space-between'},styles.headerContainer]}>
          <View>
           <Text style={{color:'#f5931f',fontSize:20,fontWeight:'bold',padding:20,paddingBottom:5}}>Admin : Gokul</Text>
           <Text style={{color:'#f5931f',fontSize:20,fontWeight:'bold',padding:20,paddingVertical:0}}>City : Chennai</Text>
          </View>
          <TouchableOpacity onPress={async () => {
            await AsyncStorage.removeItem('stores');
            navigation.navigate('Login');
           }}>
            <Text style={{color:'white',fontSize:20,fontWeight:'bold',padding:20,
             backgroundColor:'#f5931f',borderRadius:10,padding:10,margin:20}}>Logout</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cardsContainer}>
          {adminFeatures.map((feature, index) => (
            <MotiView
              key={feature.title}
              from={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: 'spring',
                delay: index * 200,
                damping: 15,
                stiffness: 200,
              }}
            >
              <Card
                style={styles.card}
                onPress={() => navigation.navigate(feature.route)}
              >
                <LinearGradient
                  colors={['#fff', '#fff5e6']}
                  style={styles.cardGradient}
                >
                  <Card.Content style={styles.cardContent}>
                    <View style={styles.iconContainer}>
                      <LinearGradient
                        colors={['#F8931F', '#f4a543']}
                        style={styles.iconGradient}
                      >
                        <Ionicons name={feature.iconName} size={24} color="white" />
                      </LinearGradient>
                    </View>
                    <Text variant="titleMedium" style={styles.cardTitle}>
                      {feature.title}
                    </Text>
                    <Text variant="bodyMedium" style={styles.cardDescription}>
                      {feature.description}
                    </Text>
                  </Card.Content>
                </LinearGradient>
              </Card>
            </MotiView>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  headerGradient: {
    padding: 20,
    borderRadius: 12,
  },
  headerText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
  },
  cardsContainer: {
    padding: 16,
    gap: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
  },
  cardGradient: {
    borderRadius: 12,
  },
  cardContent: {
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 12,
    borderRadius: 50,
    overflow: 'hidden',
  },
  iconGradient: {
    padding: 12,
    borderRadius: 50,
  },
  cardTitle: {
    marginTop: 8,
    fontWeight: 'bold',
    color: '#F8931F',
    fontSize: 18,
  },
  cardDescription: {
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.7,
    color: '#666',
  },
});

