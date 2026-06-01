import { IBookSummary } from "./Book/i-book-summary";
import { IAuthor } from "./iauthor";

export interface HomeSpotlight {
  featuredBook: IBookSummary;
  featuredAuthor: IAuthor;
  isFeaturedBookFallback: boolean;
  isFeaturedAuthorFallback: boolean;
}
