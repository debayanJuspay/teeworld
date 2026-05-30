export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  original_price?: number;
  image_urls: string[];
  stock: number;
  created_at: string;
  colors?: string[];
  sizes?: string[];
  status?: "active" | "draft";
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: "Pending" | "Paid" | "Shipped" | "Delivered";
  payment_status?: "pending" | "captured" | "failed" | "refunded";
  total: number;
  created_at: string;
  items?: OrderItem[];
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  title?: string;
  image_url?: string;
  product?: Product;
}

export interface User {
  id: string;
  email: string;
  user_metadata: {
    avatar_url?: string;
    full_name?: string;
  };
}
