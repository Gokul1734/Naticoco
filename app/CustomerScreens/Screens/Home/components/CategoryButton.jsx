import React from 'react';
import { TouchableOpacity, Image, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../styles';

const CategoryButton = ({ name, image, isSelected, onSelect, navigation }) => (
  <TouchableOpacity 
    onPress={() => navigation.navigate('FilteredItems', { category: name })}
  >
    <LinearGradient
      colors={['#FFFEFD', '#F7A02F']}
      style={[styles.profileGradient, styles.categoryButton]}
    >
      <Image 
        resizeMode='contain' 
        source={image} 
        style={[styles.categoryImage, {height: 50, width: 50}]} 
      />
      <Text style={styles.categoryName}>{name}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

export default CategoryButton;
