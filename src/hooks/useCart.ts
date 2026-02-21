import { useState, useMemo } from 'react';
import { CartItem, Product, BillingSummary } from '@/types';

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [discountValue, setDiscountValue] = useState(0);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [gstRate, setGstRate] = useState(18);

  const addToCart = (product: Product) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => 
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems(prev => 
      prev.map(i => i.id === id ? { ...i, quantity } : i)
    );
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    setDiscountValue(0);
  };

  const billing: BillingSummary = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const discount = discountType === 'percentage' 
      ? (subtotal * discountValue) / 100 
      : discountValue;
    
    const afterDiscount = subtotal - discount;
    const gstAmount = (afterDiscount * gstRate) / 100;
    const total = afterDiscount + gstAmount;

    return {
      subtotal,
      discount,
      discountType,
      gstRate,
      gstAmount,
      total,
    };
  }, [items, discountValue, discountType, gstRate]);

  return {
    items,
    billing,
    discountValue,
    discountType,
    gstRate,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    setDiscountValue,
    setDiscountType,
    setGstRate,
  };
};
