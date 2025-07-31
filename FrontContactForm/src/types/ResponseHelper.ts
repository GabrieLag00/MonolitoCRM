export interface ResponseHelper<T> {
  total: number;
  data: T;
  status: number;
  message?: string;
}