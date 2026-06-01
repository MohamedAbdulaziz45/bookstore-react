export interface IBookSummary {
  id: number;
  title: string;
  price: number;
  image?: string | null;
  author: string;
  authorId: number;
  rating: number;
  reviewCount: number;
}
