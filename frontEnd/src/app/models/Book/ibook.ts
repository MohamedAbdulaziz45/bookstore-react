export interface ibook {
  id: number;
  title: string;
  price: number;
  image?: string;
  author: string;
  authorId: number;

  description?: string;
  rating?: number;
  reviewCount: number;
  categories: IBookCategory[];
}
export interface IBookCategory {
  id: number;
  name: string;
}
