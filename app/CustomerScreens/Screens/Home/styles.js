import { StyleSheet, Platform, PixelRatio } from 'react-native';
import { SCREEN_WIDTH, SCREEN_HEIGHT, scale } from './constants';

const normalize = (size) => {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

export const styles = StyleSheet.create({
  // Copy all styles from the original file
  container: {
    flex: 0,
    backgroundColor: 'transparent',
    marginBottom: 60
  },
  // ... (paste all the styles from the original file)
});
