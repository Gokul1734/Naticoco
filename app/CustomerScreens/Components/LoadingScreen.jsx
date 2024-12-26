import { View, StyleSheet, Dimensions } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { MotiView } from 'moti';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'timing', duration: 500 }}
      >
        <ActivityIndicator size="large" color="#F8931F" />
        <Text style={styles.text}>Loading...</Text>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 