export interface IAuthor {
  authorId: number;
  name: string;
  bio: string;
  image?: string | null;
  isFeatured: boolean;
  featuredAt?: string | null;
}
