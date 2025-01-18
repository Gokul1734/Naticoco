import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
   console.log(item._id);
 
   setCartItems(prevItems => {
     // Check if item already exists in the cart
     const existingItem = prevItems.find(i => i._id === item._id);
 
     if (existingItem) {
       // Increment quantity for existing item
       return prevItems.map(i =>
         i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
       );
     }
 
     // Add new item to the cart with initial quantity
     return [...prevItems, { ...item, quantity: 1 }];
   });
 };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => 
      prevItems.filter(item => item._id || item.id !== itemId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id || item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity,
      clearCart,
      cartCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext); 