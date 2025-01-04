import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Platform } from 'react-native';
import { Text, Card, Button, Chip, DataTable, ActivityIndicator } from 'react-native-paper';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { MotiView } from 'moti';
import axios from 'axios';
import { scale, verticalScale, moderateScale } from '../utils/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const filterOrdersByTime = (orders, timeFilter) => {
  const now = new Date();
  const filterDate = new Date();

  switch (timeFilter) {
    case 'WEEK':
      filterDate.setDate(now.getDate() - 7);
      break;
    case 'MONTH':
      filterDate.setMonth(now.getMonth() - 1);
      break;
    case 'YEAR':
      filterDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      filterDate.setDate(now.getDate() - 7);
  }

  return orders.filter(order => new Date(order.date) >= filterDate);
};

const aggregateOrderData = (orders) => {
  const dailyData = {};
  
  orders.forEach(order => {
    const date = new Date(order.date).toLocaleDateString();
    if (!dailyData[date]) {
      dailyData[date] = {
        revenue: 0,
        orders: 0,
        avgOrderValue: 0
      };
    }
    
    dailyData[date].revenue += order.total;
    dailyData[date].orders += 1;
    dailyData[date].avgOrderValue = dailyData[date].revenue / dailyData[date].orders;
  });

  return Object.values(dailyData);
};

const calculateStorePerformance = (orders) => {
  const storeStats = {};
  
  orders.forEach(order => {
    if (!storeStats[order.storeId]) {
      storeStats[order.storeId] = {
        id: order.storeId,
        name: 'Unknown Store',
        orders: 0,
        revenue: 0,
        ratings: []
      };
    }
    
    storeStats[order.storeId].orders += 1;
    storeStats[order.storeId].revenue += order.total;
    if (order.rating) {
      storeStats[order.storeId].ratings.push(order.rating);
    }
  });

  // Calculate average ratings and sort by orders
  return Object.values(storeStats)
    .map(store => ({

      ...store,
      rating: store.ratings.length > 0 
        ? store.ratings.reduce((a, b) => a + b) / store.ratings.length 
        : 0
    }))
    .sort((a, b) => b.orders - a.orders);
};

const StatCard = ({ title, value, percentageChange, isPositive }) => (
  <View style={styles.statCardWrapper}>
    <MotiView
      from={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', delay: 300 }}
    >
      <Card style={styles.statCard}>
        <Card.Content>
          <Text style={styles.statTitle}>{title}</Text>
          <Text style={styles.statValue}>{value}</Text>
          <View style={styles.percentageContainer}>
            <Text style={[
              styles.percentageText,
              { color: isPositive ? '#4CAF50' : '#F44336' }
            ]}>
              {isPositive ? '↑' : '↓'} {Math.abs(percentageChange)}%
            </Text>
            <Text style={styles.periodText}>vs last month</Text>
          </View>
        </Card.Content>
      </Card>
    </MotiView>
  </View>
);

export default function OrderAnalytics() {
  const [timeFilter, setTimeFilter] = useState('WEEK');
  const [selectedMetric, setSelectedMetric] = useState('ORDERS');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalStats: {
      orders: 0,
      revenue: 0,
      avgOrderValue: 0,
      percentageChanges: {
        orders: 0,
        revenue: 0,
        avgOrderValue: 0
      }
    },
    dailyData: [],
    topStores: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, [timeFilter]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://192.168.29.165:3500/api/orders/analytics?timeFilter=${timeFilter}`);
      if (response.data) {
        setAnalytics({
          totalStats: response.data.totalStats || {
            orders: 0,
            revenue: 0,
            avgOrderValue: 0,
            percentageChanges: {
              orders: 0,
              revenue: 0,
              avgOrderValue: 0
            }
          },
          dailyData: response.data.dailyData || [],
          topStores: response.data.topStores || []
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Set default values on error
      setAnalytics({
        totalStats: {
          orders: 0,
          revenue: 0,
          avgOrderValue: 0,
          percentageChanges: {
            orders: 0,
            revenue: 0,
            avgOrderValue: 0
          }
        },
        dailyData: [],
        topStores: []
      });
    } finally {
      setLoading(false);
    }
  };

  const renderRevenueChart = () => {
    const chartData = analytics.dailyData.slice(-7);
    
    return (
      <View style={styles.chartCardWrapper}>
        <MotiView
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500 }}
        >
          <Card style={styles.chartCard}>
            <Card.Content>
              <Text style={styles.chartTitle}>Revenue Trend</Text>
              {loading ? (
                <ActivityIndicator size="large" color="#0f1c57" />
              ) : (
                <LineChart
                  data={{
                    labels: chartData.map((_, index) => 
                      ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]
                    ),
                    datasets: [{
                      data: chartData.length > 0 
                        ? chartData.map(day => Number(day.revenue) || 0)
                        : [0] // Provide default data if no data available
                    }]
                  }}
                  width={SCREEN_WIDTH - 60}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#0f1c57',
                    backgroundGradientFrom: '#0f1c57',
                    backgroundGradientTo: '#20348f',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    formatYLabel: (value) => Math.round(value).toString(),
                    style: {
                      borderRadius: 16
                    }
                  }}
                  bezier
                  style={styles.chart}
                />
              )}
            </Card.Content>
          </Card>
        </MotiView>
      </View>
    );
  };

  const renderTopPerformers = () => (
    <View style={styles.tableCardWrapper}>
      <MotiView
        from={{ opacity: 0, translateY: 50 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 500 }}
      >
        <Card style={styles.tableCard}>
          <Card.Content>
            <Text style={styles.tableTitle}>Top Performing Stores</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#0f1c57" />
            ) : (
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title textColor='#0f1c57'>Store</DataTable.Title>
                  <DataTable.Title numeric textColor='#0f1c57'>Orders</DataTable.Title>
                  <DataTable.Title numeric textColor='#0f1c57'>Rating</DataTable.Title>
                </DataTable.Header>

                {analytics.topStores.map((store) => (
                  <DataTable.Row key={store.id}>
                    <DataTable.Cell textColor='#0f1c57'>{store.name}</DataTable.Cell>
                    <DataTable.Cell numeric textColor='#0f1c57'>{store.orders}</DataTable.Cell>
                    <DataTable.Cell numeric textColor='#0f1c57'>{store.rating.toFixed(1)}</DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            )}
          </Card.Content>
        </Card>
      </MotiView>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Order Analytics</Text>
        <View style={styles.filterContainer}>
          {['WEEK', 'MONTH', 'YEAR'].map((filter) => (
            <Chip
              key={filter}
              selected={timeFilter === filter}
              onPress={() => setTimeFilter(filter)}
              style={[
                styles.filterChip,
                timeFilter === filter && styles.selectedChip
              ]}
            >
              {filter}
            </Chip>
          ))}
        </View>
      </View>

      <View style={styles.statsContainer}>
        <StatCard
          title="Total Orders"
          value={analytics.totalStats.orders.toString()}
          percentageChange={analytics.totalStats.percentageChanges.orders}
          isPositive={analytics.totalStats.percentageChanges.orders > 0}
        />
        <StatCard
          title="Revenue"
          value={`₹${analytics.totalStats.revenue.toFixed(2)}`}
          percentageChange={analytics.totalStats.percentageChanges.revenue}
          isPositive={analytics.totalStats.percentageChanges.revenue > 0}
        />
        <StatCard
          title="Avg. Order Value"
          value={`₹${analytics.totalStats.avgOrderValue.toFixed(2)}`}
          percentageChange={analytics.totalStats.percentageChanges.avgOrderValue}
          isPositive={analytics.totalStats.percentageChanges.avgOrderValue > 0}
        />
      </View>

      {renderRevenueChart()}
      {renderTopPerformers()}
    </ScrollView>
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
  filterContainer: {
    flexDirection: 'row',
    gap: scale(10),
  },
  filterChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  selectedChip: {
    backgroundColor: '#F8931F',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: scale(15),
    gap: scale(10),
  },
  statCardWrapper: {
    flex: 1,
    minWidth: '30%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  statCard: {
    borderRadius: scale(12),
    backgroundColor: 'white',
  },
  statTitle: {
    fontSize: moderateScale(14),
    color: '#666',
  },
  statValue: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: '#0f1c57',
    marginVertical: verticalScale(5),
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(5),
  },
  percentageText: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
  },
  periodText: {
    fontSize: moderateScale(12),
    color: '#666',
  },
  chartCardWrapper: {
    margin: scale(15),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  chartCard: {
    borderRadius: scale(12),
    backgroundColor: 'white',
  },
  chartTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#0f1c57',
    marginBottom: verticalScale(15),
  },
  chart: {
    borderRadius: scale(12),
    marginVertical: verticalScale(10),
  },
  tableCardWrapper: {
    margin: scale(15),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tableCard: {
    borderRadius: scale(12),
    backgroundColor: 'white',
  },
  tableTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#0f1c57',
    marginBottom: verticalScale(15),
  },
});
