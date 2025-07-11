import { Request, Response } from 'express';
import { ICity } from './city.interface';
import { IPlace } from './place.interface';
import { IService } from './service.interface';
import { IState } from './state.interface';

export interface TypedRequest<T = any> extends Request {
  body: T;
}

export interface TypedRequestParams<P = any> extends Request {
  params: P;
}

export interface TypedRequestQuery<Q = any> extends Request {
  query: Q;
}

export interface TypedRequestBody<T = any> extends Request {
  body: T;
}

export interface TypedResponse<T = any> extends Response {
  json: (body: T) => TypedResponse<T>;
}
