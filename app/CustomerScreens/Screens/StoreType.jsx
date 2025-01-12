import { View, StyleSheet, TouchableOpacity, Image, Dimensions, Text, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { MotiView } from 'moti';
import { useNavigation } from '@react-navigation/native';
import JuciyBanner from '../../../assets/images/JuicyBanner.png';
import CrispyBanner from '../../../assets/images/CrispyBanner.png';
import breast from '../../../assets/images/breast.png';
import egg from '../../../assets/images/eggs.png';
import lemon1 from '../../../assets/images/l1.png';
import leg from '../../../assets/images/leg.png';
import lemon3 from '../../../assets/images/l3.png';
import LoadingScreen from '../Components/LoadingScreen';
import { Asset } from 'expo-asset';
import ScreenBackground from '../Components/ScreenBackground';
import { useLoadAssets } from '../../hooks/useLoadAssets';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const StoreButton = ({title, image, onPress, delay }) => (
  <MotiView
    // from={{ opacity: 0, scale: 0.9 }}
    // animate={{ opacity: 1, scale: 1 }}
    transition={{
      type: 'spring',
      delay,
      duration: 1000,
    }}
  >
    <Text style={styles.subtitle}>{title}</Text>
    <TouchableOpacity 
      onPress={onPress}
      style={styles.buttonContainer}
    >
      <Image 
        source={image} 
        style={styles.banner}
        resizeMode="contain"
      />
    </TouchableOpacity>
  </MotiView>
);

const storeImages = {
  juicyBanner: JuciyBanner,
  crispyBanner: CrispyBanner,
  breast,
  egg,
  lemon1,
  leg,
  lemon3,
};

export default function StoreType() {
  const navigation = useNavigation();
  const isLoading = useLoadAssets(storeImages);
  
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Store Category</Text>
        <StoreButton
          title="Juicy Chicken Delight Store"
          image={JuciyBanner}
          delay={300}
          onPress={() => navigation.navigate('MainTabs')}
        />
        <StoreButton
          title="Fried Chicken Store"
          image={CrispyBanner}
          delay={500}
          onPress={() => navigation.navigate('CrispyHome')}
        />
        <View style={{marginTop: 10}}>
          <View style={styles.quoteContainer}>
            <Text style={[{color: '#F8931F'}, styles.subtitle]}>"Farm-Fresh ,</Text>
            <Text style={styles.subtitle}>Tender Chicken"</Text>
          </View>
          <View style={[styles.quoteContainer, { marginTop: -15 }]}>
            <Text style={styles.subtitle}>"Healthy Eating ,</Text>
            <Text style={[{color: '#F8931F'}, styles.subtitle]}>Happy Living."</Text>
          </View>
        </View>
        <Image source={breast} style={{width:100,height:100,alignSelf:'start',left:Platform.OS == 'ios' ? SCREEN_WIDTH-450 : SCREEN_WIDTH-390}} />
        <Image source={lemon1} style={{position:'absolute',width:40,height:40,alignSelf:'center',marginTop:650,left:130}} />
        <Image source={lemon1} style={{position:'absolute',width:40,height:40,alignSelf:'center',top:750,left:320}} />
        <Image source={lemon3} style={{position:'absolute',width:40,height:40,alignSelf:'center',top:650,left:250}} />
        <Image source={leg} style={{position:'absolute',width:100,height:100,alignSelf:'center',top:620,left:SCREEN_WIDTH - 100}} />
        <Image source={egg} style={{width:140,height:120,alignSelf:'center',marginTop:Platform.OS == 'android' ? -100 : -10}} />
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'start',
    gap: 20,
    padding: 20,
  },
  title: {
    fontSize: SCREEN_WIDTH * 0.08,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 10,
    marginLeft: 10,
    color: '#F8931F',
  },
  subtitle: {
    fontSize: SCREEN_WIDTH * 0.05,
    fontWeight: 'bold',
    marginVertical: 10,
    marginLeft: 10,
    // color: '#000',
  },
  quoteContainer: {
    flexDirection: 'row',
    gap: -5,
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    marginLeft: 15,
    padding: 0,
  },
  buttonContainer: {
    borderRadius: 15,
    overflow: 'visible',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  banner: {
    width: '100%',
    height: SCREEN_WIDTH * 0.3,
  },
});
