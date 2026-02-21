import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { getProducts, saveProducts } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: uuidv4() };
    const updated = [...products, newProduct];
    setProducts(updated);
    saveProducts(updated);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updated = products.map(p => 
      p.id === id ? { ...p, ...updates } : p
    );
    setProducts(updated);
    saveProducts(updated);
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    saveProducts(updated);
  };

  return { products, addProduct, updateProduct, deleteProduct };
};
