import { Express } from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import config from '../src/config/env';
import { ICity } from '../src/types/city.interface';
import { IState } from '../src/types/state.interface';
import { IPlace } from '../src/types/place.interface';
import { IService } from '../src/types/service.interface';

export const generateAuthToken = (userId: string): string => {
  return jwt.sign({ userId }, config.JWT_SECRET, { expiresIn: '1d' });
};

export const testRequest = (app: Express) => {
  return request(app);
};

export const createTestCity = async (app: Express, city: Partial<ICity>, token?: string): Promise<ICity> => {
  const response = await testRequest(app)
    .post('/cities')
    .set('Authorization', `Bearer ${token}`)
    .send(city);
  
  return response.body;
};

export const createTestState = async (app: Express, state: Partial<IState>, token?: string): Promise<IState> => {
  const response = await testRequest(app)
    .post('/states')
    .set('Authorization', `Bearer ${token}`)
    .send(state);
  
  return response.body;
};

export const createTestPlace = async (app: Express, place: Partial<IPlace>, token?: string): Promise<IPlace> => {
  const response = await testRequest(app)
    .post('/places')
    .set('Authorization', `Bearer ${token}`)
    .send(place);
  
  return response.body;
};

export const createTestService = async (app: Express, service: Partial<IService>, token?: string): Promise<IService> => {
  const response = await testRequest(app)
    .post('/services')
    .set('Authorization', `Bearer ${token}`)
    .send(service);
  
  return response.body;
};
