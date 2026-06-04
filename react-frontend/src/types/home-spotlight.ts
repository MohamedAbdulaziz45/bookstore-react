import type { IBookSummary } from "./book.types";
import type { IAuthor } from "./author.types";

export interface HomeSpotlight {
  featuredBook: IBookSummary;
  featuredAuthor: IAuthor;
  isFeaturedBookFallback: boolean;
  isFeaturedAuthorFallback: boolean;
}
