import { ibook } from "./Book/ibook";

export interface Book {
  id: string;
  title: string;
  price: number;
  image: string;
  author?: string;
  category?: string[];
  description?: string;
  rating?: number;
  reviewCount?: number;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  count?: number;
}

export interface AuthorBook {
  id: string;
  title: string;
  priceRange: string;
  image?: string;
}

export interface Author {
  id: string;
  name: string;
  role: string;
  image: string;
  social: { facebook?: string; linkedin?: string; instagram?: string };
}

export interface CartItem {
  book: ibook;
  quantity: number;
}

export interface NavItem {
  label: string;
  path: string;
}
