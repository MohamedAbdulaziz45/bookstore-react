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
