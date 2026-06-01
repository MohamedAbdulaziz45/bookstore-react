export interface ICreateAuthorRequest {
  name: string;
  bio: string;
  image?: string | null;
  isFeatured: boolean;
  featuredSortOrder?: number | null;
}
