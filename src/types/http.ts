import { CookieOptions } from 'express';

export interface IHttpRequest {
  ip: string;
  params: any;
  body: any;
  query: any;
  cookies: any;
  username?: string;
}

export interface IHttpResponse<T = any> {
  status: number;
  headers?: any;
  data: T | null;
  error?: any;
  cookies?: Array<{ key: string; value: string; options: CookieOptions }>;
}
