import { Product, Order } from '@/types';

const PRODUCTS_KEY = 'billing_products';
const ORDERS_KEY = 'billing_orders';

// Default products for demo
const defaultProducts: Product[] = [
  { id: '1', name: 'Wireless Mouse', price: 799, category: 'Electronics', stock: 50 },
  { id: '2', name: 'USB-C Cable', price: 299, category: 'Accessories', stock: 100 },
  { id: '3', name: 'Keyboard', price: 1499, category: 'Electronics', stock: 30 },
  { id: '4', name: 'Monitor Stand', price: 1999, category: 'Furniture', stock: 20 },
  { id: '5', name: 'Webcam HD', price: 2499, category: 'Electronics', stock: 25 },
  { id: '6', name: 'Desk Lamp', price: 899, category: 'Furniture', stock: 40 },
];

export const getProducts = (): Product[] => {
  const stored = localStorage.getItem(PRODUCTS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
  return defaultProducts;
};

export const saveProducts = (products: Product[]): void => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const getOrders = (): Order[] => {
  const stored = localStorage.getItem(ORDERS_KEY);
  if (stored) {
    return JSON.parse(stored).map((order: Order) => ({
      ...order,
      createdAt: new Date(order.createdAt),
    }));
  }
  return [];
};

export const saveOrders = (orders: Order[]): void => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

export const exportToCSV = (orders: Order[]): void => {
  if (orders.length === 0) return;

  const headers = ['Order ID', 'Date', 'Items', 'Subtotal', 'Discount', 'GST', 'Total', 'Status'];
  
  const rows = orders.map(order => [
    order.id,
    new Date(order.createdAt).toLocaleString(),
    order.items.map(i => `${i.name} x${i.quantity}`).join('; '),
    order.subtotal.toFixed(2),
    order.discount.toFixed(2),
    order.gstAmount.toFixed(2),
    order.total.toFixed(2),
    order.status,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
};
