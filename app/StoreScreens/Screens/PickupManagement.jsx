import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { MotiView } from 'moti';
import QRCode from 'react-native-qrcode-svg';
import { scale, verticalScale, moderateScale } from '../../utils/responsive';

const Timer = ({ minutes, onTimeout }) => {
  const [seconds, setSeconds] = useState(minutes * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds <= 1) {
          clearInterval(interval);
          onTimeout();
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [minutes, onTimeout]);

  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <MotiView
      from={{ scale: 1 }}
      animate={{ scale: seconds % 2 === 0 ? 1.1 : 1 }}
      transition={{ type: 'timing', duration: 500 }}
    >
      <Text style={styles.timer}>{formatTime()}</Text>
    </MotiView>
  );
};

export default function PickupManagement({ route, navigation }) {
  const { order } = route.params;
  const [isExpired, setIsExpired] = useState(false);

  const handleTimeout = () => {
    setIsExpired(true);
    // Handle order timeout logic here
  };

  const generateOrderQRData = () => {
    return JSON.stringify({
      orderId: order.id,
      items: order.items,
      total: order.total,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <View style={styles.container}>
      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 1000 }}
      >
        <Card style={styles.pickupCard}>
          <Card.Content>
            <Text style={styles.headerText}>Order Ready for Pickup</Text>
            <Text style={styles.orderId}>Order #{order.id}</Text>

            <View style={styles.qrContainer}>
              <QRCode
                value={generateOrderQRData()}
                size={200}
                color="#0f1c57"
              />
            </View>

            <View style={styles.timerSection}>
              <Text style={styles.timerLabel}>
                Time remaining for pickup:
              </Text>
              <Timer minutes={10} onTimeout={handleTimeout} />
            </View>

            {isExpired && (
              <Text style={styles.expiredText}>
                Pickup time expired! Please contact support.
              </Text>
            )}

            <View style={styles.orderDetails}>
              <Text style={styles.detailsHeader}>Order Details:</Text>
              {order.items.map((item, index) => (
                <Text key={index} style={styles.itemText}>
                  {item.quantity}x {item.name}
                </Text>
              ))}
              <Text style={styles.totalText}>
                Total: ₹{order.total}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(20),
    justifyContent: 'center',
  },
  pickupCard: {
    borderRadius: scale(15),
    elevation: 4,
  },
  headerText: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: '#0f1c57',
    textAlign: 'center',
    marginBottom: verticalScale(10),
  },
  orderId: {
    fontSize: moderateScale(18),
    color: '#666',
    textAlign: 'center',
    marginBottom: verticalScale(20),
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: verticalScale(20),
    padding: scale(20),
    backgroundColor: '#fff',
    borderRadius: scale(10),
  },
  timerSection: {
    alignItems: 'center',
    marginVertical: verticalScale(20),
  },
  timerLabel: {
    fontSize: moderateScale(16),
    color: '#666',
    marginBottom: verticalScale(5),
  },
  timer: {
    fontSize: moderateScale(32),
    fontWeight: 'bold',
    color: '#0f1c57',
  },
  expiredText: {
    color: '#F44336',
    fontSize: moderateScale(16),
    textAlign: 'center',
    marginVertical: verticalScale(10),
  },
  orderDetails: {
    marginTop: verticalScale(20),
    padding: scale(15),
    backgroundColor: '#f5f5f5',
    borderRadius: scale(10),
  },
  detailsHeader: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    marginBottom: verticalScale(10),
  },
  itemText: {
    fontSize: moderateScale(14),
    color: '#333',
    marginBottom: verticalScale(5),
  },
  totalText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    marginTop: verticalScale(10),
    color: '#0f1c57',
  },
}); 