import { Request, Response } from 'express';

import { IHttpRequest, IHttpResponse } from '../types/http';

export function makeExpressCallback<T extends any>(
  controller: T,
  action: keyof T
) {
  return async (req: Request, res: Response) => {
    try {
      const request: IHttpRequest = {
        ip: req.ip,
        body: req.body,
        params: req.params,
        query: req.query
      };
      const response: IHttpResponse = await controller[action](request);
      if (response.headers) {
        res.set(response.headers);
      }
      if (response.cookies) {
        for (const cookie of response.cookies) {
          res.cookie(cookie.key, cookie.value, cookie.options);
        }
      }
      res.type('json');
      res.status(response.status).send(response.data);
    } catch (error) {
      res
        .status(error.status || 500)
        .send({ message: error.message || 'Internal server error', error });
    }
  };
}
