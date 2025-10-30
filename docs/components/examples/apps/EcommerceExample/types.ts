export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  inStock: boolean;
  description: string;
}

export interface CartItem {
  id: number;
  quantity: number;
}

export interface CartItemWithProduct extends CartItem {
  product: Product;
}
