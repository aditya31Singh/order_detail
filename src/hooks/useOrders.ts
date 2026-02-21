import { useState, useEffect } from 'react';
import { Order, CartItem, BillingSummary } from '@/types';
import { getOrders, saveOrders, exportToCSV } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  const createOrder = (items: CartItem[], billing: BillingSummary): Order => {
    const order: Order = {
      id: uuidv4().slice(0, 8).toUpperCase(),
      items,
      ...billing,
      createdAt: new Date(),
      status: 'completed',
    };
    const updated = [order, ...orders];
    setOrders(updated);
    saveOrders(updated);
    return order;
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    const updated = orders.map(o => 
      o.id === id ? { ...o, status } : o
    );
    setOrders(updated);
    saveOrders(updated);
  };

  const exportOrders = () => {
    exportToCSV(orders);
  };

  return { orders, createOrder, updateOrderStatus, exportOrders };
};
