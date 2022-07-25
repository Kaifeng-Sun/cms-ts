export interface Paginator {
  page: number; // start: 1;
  limit: number;
  total?: number;
}

export interface QueryParams {
  [key: string]: string | number;
}

export interface IResponse<T = any> {
  code: number;
  msg: string;
  data?: T;
}

export interface ListResponse {
  total: number;
  paginator?: Paginator;
}

export type DeleteResponse = boolean;

export type RequestOmitPaginator<T> = Omit<T, 'page' | 'limit'>;
