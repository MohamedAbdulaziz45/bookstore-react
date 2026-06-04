export type AuthorBooksSortBy =
  | "Title"
  | "Price"
  | "Author"
  | "Rating"
  | "PublicationDate";

export type SortDirection = "Ascending" | "Descending";
export type AuthorBooksPageSize = 4 | 8 | 12 | 24;

export interface IAuthorBooksQuery {
  searchPhrase?: string;
  pageNumber: number;
  pageSize: AuthorBooksPageSize;
  sortBy?: AuthorBooksSortBy;
  sortDirection: SortDirection;
}
export interface IAuthor {
  authorId: number;
  name: string;
  bio: string;
  image?: string | null;
  isFeatured: boolean;
  featuredAt?: string | null;
}
export interface ICreateAuthorRequest {
  name: string;
  bio: string;
  image?: File;
  isFeatured: boolean;
  featuredSortOrder?: number | null;
}

export interface IFeaturedAuthor {
  author: IAuthor;
  isFallback: boolean;
}
export interface IUpdateAuthorRequest extends ICreateAuthorRequest {
  authorId: number;
}
