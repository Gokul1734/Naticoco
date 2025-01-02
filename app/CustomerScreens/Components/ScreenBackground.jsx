import { ImageBackground, StyleSheet, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';
import { Asset } from 'expo-asset';
import LoadingScreen from './LoadingScreen';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const backgroundImage = require('../../../assets/images/backdrop.jpg');

export default function ScreenBackground({ children, style }) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadBackgroundImage = async () => {
      try {
        await Asset.loadAsync([backgroundImage]);
        if (isMounted) {
          setIsImageLoaded(true);
        }
      } catch (error) {
        console.error('Error loading background image:', error);
        if (isMounted) {
          setIsImageLoaded(true);
        }
      }
    };

    loadBackgroundImage();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!isImageLoaded) {
    return <LoadingScreen />;
  }

  return (
    <ImageBackground 
      source={backgroundImage}
      style={[styles.background, style]}
      resizeMode="cover"
      imageStyle={{ opacity: 0.7 }}
    >
      <View style={styles.grayOverlay} />
      
      <View style={[styles.container, style]}>
        {children}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    padding: 0,
    margin: 0,
  },
  grayOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  container: {
    flex: 1,
    padding: 0,
    margin: 0,
  },
}); 