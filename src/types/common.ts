export interface RequestResponse {
  message: string;
  statusCode: number;
}

export interface ListApiResponse<T> {
  data: T[];
  meta: Meta;
}

export interface Meta {
  total: number;
  skip: number;
  take: number;
}

export interface GetApiResponse<T> {
  data: T;
}
