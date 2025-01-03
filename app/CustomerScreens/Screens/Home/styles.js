import { StyleSheet, Platform, PixelRatio } from 'react-native';
import { SCREEN_WIDTH, SCREEN_HEIGHT, scale } from './constants';

const normalize = (size) => {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: 'transparent',
    marginBottom: 60
  },
  flexcont: {
   justifyContent : "space-between",
   alignItems: 'center',
   flexDirection:'row',
   padding:10
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderWidth: 2,
    borderColor: '#df8229',
    // backgroundColor: '#df8229',
    width: '90%',
    
    marginBottom: 20,
    alignSelf: 'center',
    borderRadius: 80,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    flexWrap: 'wrap',
  },
  address: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
    color: '#333',
    maxWidth: '100%',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  profileButton: {
    marginLeft: 8,
  },
  sectionContainer: {
    padding: normalize(16),
    paddingBottom: Platform.OS === 'ios' ? normalize(16) : normalize(8),
    backgroundColor:'transparent'
  },
  sectionTitle: {
    fontSize: normalize(18),
    fontWeight: '600',
    marginBottom: normalize(16),
  },
  categoryButton: {
    flex: 1,
    alignItems: 'center',
    padding: normalize(15),
    margin: normalize(5),
    backgroundColor: '#fff',
    borderRadius: normalize(12),
    minWidth: (SCREEN_WIDTH - normalize(40)) / 3.3,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    height : 100
  },
  selectedCategory: {
    backgroundColor: '#fff5e6',
    borderWidth: 1,
    borderColor: '#F8931F',
  },
  categoryImageContainer: {
    width: normalize(60),
    height: normalize(80),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(10),
    borderRadius: normalize(25),
    backgroundColor: '#f5f5f5',
  },
  categoryImage: {
    width: 48,
    height: 42,
    margin:1
    
  },
  selectedCategoryImage: {
    tintColor: '#F8931F',
  },
  categoryText: {
    fontSize: normalize(12),
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: '#F8931F',
    fontWeight: '600',
  },
  horizontalList: {
    paddingRight: normalize(16),
    paddingVertical: normalize(10),
    backgroundColor:'transparent'
  },
  productCard: {
    width: SCREEN_WIDTH * 0.55, // 55% of screen width
    marginRight: normalize(16),
    backgroundColor: '#E6E6E6',
    borderRadius: normalize(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: Platform.OS === 'ios' ? 2 : 1,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 6,
  },
  productImage: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.15, // 15% of screen height
    borderTopLeftRadius: normalize(12),
    borderTopRightRadius: normalize(12),
  },
  productName: {
    fontSize: normalize(14),
    fontWeight: '600',
    padding: normalize(8),
    marginBottom: normalize(10),
  },
  productPrice: {
    fontSize: normalize(14),
    fontWeight: '700',
    color: '#89C73A',
    paddingHorizontal: normalize(8),
    paddingBottom: normalize(8),
  },
  cartActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: normalize(8),
  },
  quantityBadge: {
    backgroundColor: '#89C73A',
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  cart: {
    backgroundColor: '#F8931F',
    padding: normalize(7),
    borderRadius: normalize(5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: normalize(5),
  },
  addToCartText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  cartButton: {
    position: 'relative',
    backgroundColor: 'white',
    padding: normalize(8),
    borderRadius: normalize(12),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cartBadge: {
    position: 'absolute',
    top: -normalize(8),
    right: -normalize(8),
    backgroundColor: '#F8931F',
    borderRadius: normalize(10),
    minWidth: normalize(18),
    height: normalize(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: normalize(12),
    fontWeight: 'bold',
    paddingHorizontal: normalize(4),
  },
  headerGradient: {
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(16),
    borderBottomLeftRadius: normalize(40),
    borderBottomRightRadius: normalize(40),
    ...Platform.select({
     ios: {
       shadowColor: '#000',
       shadowOffset: { width: 0, height: 2 },
       shadowOpacity: 0.1,
       shadowRadius: 4,
     },
     android: {
       elevation: 3,
     },
   }),
  },
  headerContent: {
    gap: normalize(12),
  },
  welcomeSection: {
    marginBottom: normalize(8),
    margin : 10
  },
  welcomeText: {
    fontSize: normalize(14),
    color: '#666',
  },
  userName: {
    fontSize: normalize(20),
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: '#333',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: normalize(12),
    borderRadius: normalize(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: Platform.OS === 'ios' ? 2 : 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationIcon: {
    marginRight: 8,
  },
  locationTextContainer: {
    flex: 1,
  },
  deliverToText: {
    fontSize: 12,
    color: '#666',
  },
  addressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: normalize(16),
  },
  cartButton: {
    position: 'relative',
    backgroundColor: 'white',
    padding: normalize(8),
    borderRadius: normalize(12),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cartBadge: {
    position: 'absolute',
    top: -normalize(8),
    right: -normalize(8),
    backgroundColor: '#F8931F',
    borderRadius: normalize(10),
    minWidth: normalize(18),
    height: normalize(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: normalize(12),
    fontWeight: 'bold',
    paddingHorizontal: normalize(4),
  },
  profileButton: {
    overflow: 'hidden',
    borderRadius: normalize(12),
  },
  profileGradient: {
    padding: normalize(8),
    borderRadius: normalize(12),
  },
  scrollViewContent: {
    paddingBottom: normalize(60),
  },
});