export const mockOrders = [
  {
    id: 'ORD001',
    userId: 'USR001',
    storeId: 'STR001',
    items: [
      { id: 'PRD001', name: 'Crispy Chicken', quantity: 2, price: 299 },
      { id: 'PRD002', name: 'French Fries', quantity: 1, price: 99 }
    ],
    total: 697,
    status: 'COMPLETED',
    rating: 4.5,
    date: '2024-03-15',
    deliveryTime: 25
  },
  {
    id: 'ORD002',
    userId: 'USR002',
    storeId: 'STR002',
    items: [
      { id: 'PRD003', name: 'Chicken Burger', quantity: 3, price: 199 }
    ],
    total: 597,
    status: 'COMPLETED',
    rating: 4.0,
    date: '2024-03-14',
    deliveryTime: 30
  },
  // Add more orders with different dates
  ...Array.from({ length: 48 }, (_, i) => ({
    id: `ORD${(i + 3).toString().padStart(3, '0')}`,
    userId: `USR${Math.floor(Math.random() * 10 + 1).toString().padStart(3, '0')}`,
    storeId: `STR${Math.floor(Math.random() * 5 + 1).toString().padStart(3, '0')}`,
    items: [
      {
        id: `PRD${Math.floor(Math.random() * 20 + 1).toString().padStart(3, '0')}`,
        name: 'Random Item',
        quantity: Math.floor(Math.random() * 3 + 1),
        price: Math.floor(Math.random() * 300 + 100)
      }
    ],
    total: Math.floor(Math.random() * 1000 + 200),
    status: ['COMPLETED', 'PENDING', 'CANCELLED'][Math.floor(Math.random() * 3)],
    rating: Math.floor(Math.random() * 2 + 3) + Math.random(),
    date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    deliveryTime: Math.floor(Math.random() * 20 + 20)
  }))
];

export const mockStores = [
  {
    id: 'STR001',
    name: 'Crispy Chicken Express',
    area: 'Hyderabad Central',
    rating: 4.2,
    totalOrders: 1250,
    avgDeliveryTime: 28,
    items: [
      {
        id: 'ITEM001',
        name: 'Crispy Chicken',
        description: 'Tender chicken pieces marinated in special spices and fried to perfection',
        price: 299,
        category: 'Main Course',
        image: require('../../assets/images/Burger.jpg'),
        inStock: true,
        stockCount: 50
      },
      {
        id: 'ITEM002',
        name: 'Chicken Biryani',
        description: 'Aromatic basmati rice cooked with tender chicken and authentic spices',
        price: 399,
        category: 'Main Course',
        image: require('../../assets/images/Burger.jpg'),
        inStock: true,
        stockCount: 30
      }
    ],
    location: {
      latitude: 17.4485835,
      longitude: 78.3908034,
    },
    address: '123 Food Street, Hyderabad Central',
    contactNumber: '+91 9876543210',
    openingHours: {
      monday: { open: '10:00', close: '22:00' },
      tuesday: { open: '10:00', close: '22:00' },
      wednesday: { open: '10:00', close: '22:00' },
      thursday: { open: '10:00', close: '22:00' },
      friday: { open: '10:00', close: '23:00' },
      saturday: { open: '10:00', close: '23:00' },
      sunday: { open: '11:00', close: '22:00' }
    },
    isActive: true
  },
  {
    id: 'STR002',
    name: 'Nati Kitchen',
    area: 'Hyderabad North',
    rating: 4.5,
    totalOrders: 980,
    avgDeliveryTime: 25,
    items: [
      {
        id: 'ITEM003',
        name: 'Nati Chicken Curry',
        description: 'Traditional country chicken curry cooked with native spices',
        price: 449,
        category: 'Main Course',
        image: require('../../assets/images/Burger.jpg'),
        inStock: true,
        stockCount: 25
      },
      {
        id: 'ITEM004',
        name: 'Chicken 65',
        description: 'Spicy deep-fried chicken with curry leaves and green chilies',
        price: 349,
        category: 'Starters',
        image: require('../../assets/images/Burger.jpg'),
        inStock: true,
        stockCount: 40
      }
    ],
    location: {
      latitude: 17.4555835,
      longitude: 78.3928034,
    },
    address: '456 Spice Road, Hyderabad North',
    contactNumber: '+91 9876543211',
    openingHours: {
      monday: { open: '11:00', close: '23:00' },
      tuesday: { open: '11:00', close: '23:00' },
      wednesday: { open: '11:00', close: '23:00' },
      thursday: { open: '11:00', close: '23:00' },
      friday: { open: '11:00', close: '23:30' },
      saturday: { open: '11:00', close: '23:30' },
      sunday: { open: '11:00', close: '23:00' }
    },
    isActive: true
  }
];

export const generateMockStores = (count = 8) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `STR${(i + 3).toString().padStart(3, '0')}`,
    name: `Store ${i + 3}`,
    area: ['Hyderabad North', 'Hyderabad South', 'Hyderabad East', 'Hyderabad West'][Math.floor(Math.random() * 4)],
    rating: (Math.floor(Math.random() * 2 + 3) + Math.random()).toFixed(1),
    totalOrders: Math.floor(Math.random() * 1000 + 500),
    avgDeliveryTime: Math.floor(Math.random() * 15 + 20),
    items: Array.from({ length: Math.floor(Math.random() * 5 + 5) }, (_, j) => ({
      id: `ITEM${(i * 10 + j + 5).toString().padStart(3, '0')}`,
      name: `Product ${i * 10 + j + 5}`,
      description: 'Delicious chicken preparation with special spices',
      price: Math.floor(Math.random() * 300 + 200),
      category: ['Main Course', 'Starters', 'Sides', 'Beverages'][Math.floor(Math.random() * 4)],
      image: require('../../assets/images/Burger.jpg'),
      inStock: Math.random() > 0.2,
      stockCount: Math.floor(Math.random() * 50 + 10)
    })),
    location: {
      latitude: 17.4485835 + (Math.random() - 0.5) * 0.1,
      longitude: 78.3908034 + (Math.random() - 0.5) * 0.1,
    },
    address: `${Math.floor(Math.random() * 999) + 1} Food Street, Hyderabad`,
    contactNumber: `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
    openingHours: {
      monday: { open: '10:00', close: '22:00' },
      tuesday: { open: '10:00', close: '22:00' },
      wednesday: { open: '10:00', close: '22:00' },
      thursday: { open: '10:00', close: '22:00' },
      friday: { open: '10:00', close: '23:00' },
      saturday: { open: '10:00', close: '23:00' },
      sunday: { open: '11:00', close: '22:00' }
    },
    isActive: Math.random() > 0.1
  }));
};

export const allStores = [...mockStores, ...generateMockStores()];

export const storeItems = allStores.reduce((acc, store) => {
  store.items.forEach(item => {
    acc[item._id || item.id] = {
      ...item,
      storeId: store.id,
      storeName: store.name
    };
  });
  return acc;
}, {});

export const mockProducts = [
  {
    id: 'PRD001',
    name: 'Crispy Chicken',
    category: 'Main Course',
    price: 299,
    totalOrders: 850,
    rating: 4.5
  },
  // Add about 20 more products
]; 