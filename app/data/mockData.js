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
    avgDeliveryTime: 28
  },
  // Add more stores
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `STR${(i + 2).toString().padStart(3, '0')}`,
    name: `Store ${i + 2}`,
    area: ['Hyderabad North', 'Hyderabad South', 'Hyderabad East', 'Hyderabad West'][Math.floor(Math.random() * 4)],
    rating: Math.floor(Math.random() * 2 + 3) + Math.random(),
    totalOrders: Math.floor(Math.random() * 1000 + 500),
    avgDeliveryTime: Math.floor(Math.random() * 15 + 20)
  }))
];

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