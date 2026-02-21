export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
  gstRate: number;
  gstAmount: number;
  total: number;
  createdAt: Date;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface BillingSummary {
  subtotal: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
  gstRate: number;
  gstAmount: number;
  total: number;
}
