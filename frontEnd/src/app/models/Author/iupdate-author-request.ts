import { ICreateAuthorRequest } from "./icreate-author-request";

export interface IUpdateAuthorRequest extends ICreateAuthorRequest {
  authorId: number;
}
