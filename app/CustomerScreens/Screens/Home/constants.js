import { Dimensions } from 'react-native';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;
export const scale = SCREEN_WIDTH / 375;

export const categories = [
  { 
    id: '1', 
    name: 'Chicken', 
    image: require('../../../../assets/images/HomeCategories/Nati.png')
  },
  { 
    id: '2', 
    name: 'Marinated', 
    image: require('../../../../assets/images/HomeCategories/Marinate.png')
  },
  { 
    id: '3', 
    name: 'Heat & Eat', 
    image: require('../../../../assets/images/HomeCategories/Chicken.png')
  },
  { 
    id: '4', 
    name: 'Eggs', 
    image: require('../../../../assets/images/HomeCategories/Egg.png') 
  },
  { 
    id: '5', 
    name: 'Spices', 
    image: require('../../../../assets/images/HomeCategories/Spice.png')
  },
  { 
    id: '6', 
    name: 'Pet Food', 
    image: require('../../../../assets/images/HomeCategories/Petfood.png')
  },
  { 
    id: '7', 
    name: 'Mutton', 
    image: require('../../../../assets/images/HomeCategories/Steak.png')
  },
  { 
    id: '8', 
    name: 'Post Order', 
    image: require('../../../../assets/images/HomeCategories/FD.png')
  },
];

export const productImages = {
  'logoo.jpg': require('../../../../assets/images/logoo.jpg'),
  'ChickenKebab.jpg': require('../../../../assets/images/ChickenKebab.jpg'),
  'tandoori.jpg': require('../../../../assets/images/tandoori.jpg'),
  'wob.jpg': require('../../../../assets/images/wob.jpeg'),
  'thighs.jpg': require('../../../../assets/images/thighs.jpeg'),
  'ggp.jpg': require('../../../../assets/images/ggp.jpg'),
  'heat and eat.jpeg': require('../../../../assets/images/heat and eat.jpeg'),
  'classic chicken momos.jpg': require('../../../../assets/images/classic chicken momos.jpg'),
  'natiChicken.jpg': require('../../../../assets/images/natiChicken.jpg'),
};
