export interface ISuccessResponse {
  success: boolean;
}

export interface IMessageResponse extends ISuccessResponse {
  message: string;
}

export interface IDataResponse<T = any> extends ISuccessResponse {
  data: T;
}

export interface IDataMessageResponse<T = any> extends IMessageResponse {
  data: T;
}

export interface IListResponse<T = any> extends ISuccessResponse {
  data: T[];
  total_count: number;
  total_pages: number;
  prev_enable: boolean | number;
  next_enable: boolean | number;
  per_page: number;
  page: number;
}
