export interface IpagedResult<T> {
  items: T[];
  totalPages: number;
  totalItemsCount: number;
  itemsFrom: number;
  itemsTo: number;
}

export interface IPagedResultWithMeta<T, TMeta> extends IpagedResult<T> {
  meta: TMeta;
}
