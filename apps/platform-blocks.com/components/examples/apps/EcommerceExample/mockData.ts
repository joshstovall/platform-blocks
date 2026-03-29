import { Product } from './types';

export const categories = ['All', 'Audio', 'Wearables', 'Accessories', 'Computing'];

export const products: Product[] = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 129.99,
    originalPrice: 149.99,
    rating: 4.5,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=600&q=80',
    category: 'Audio',
    inStock: true,
    description: 'Premium wireless headphones with noise cancellation'
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 299.99,
    rating: 4.8,
    reviews: 567,
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/46/HOT_Watch_Smart_Watch_from_Kickstarter_01.JPG',
    category: 'Wearables',
    inStock: true,
    description: 'Advanced fitness tracking and smart notifications'
  },
  {
    id: 3,
    name: 'Laptop Stand',
    price: 49.99,
    rating: 4.2,
    reviews: 123,
    image: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Macbook_Air.jpg',
    category: 'Accessories',
    inStock: false,
    description: 'Ergonomic adjustable laptop stand'
  },
  {
    id: 4,
    name: 'Bluetooth Speaker',
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.6,
    reviews: 345,
    image: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/UE_Boom_speakers.jpg',
    category: 'Audio',
    inStock: true,
    description: 'Portable speaker with rich bass'
  },
  {
    id: 5,
    name: 'Mechanical Keyboard',
    price: 159.99,
    rating: 4.7,
    reviews: 456,
    image: 'https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=600&q=80',
    category: 'Computing',
    inStock: true,
    description: 'RGB mechanical gaming keyboard'
  },
  {
    id: 6,
    name: 'USB-C Hub',
    price: 39.99,
    rating: 4.3,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1527430253228-e93688616381?auto=format&fit=crop&w=600&q=80',
    category: 'Accessories',
    inStock: true,
    description: '7-in-1 USB-C hub with HDMI and ethernet'
  }
];
