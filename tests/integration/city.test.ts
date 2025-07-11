import app from '../../src/app';
import { createTestCity, createTestState, testRequest } from '../helpers';
import { ICity } from '../../src/types/city.interface';

describe('City Controller', () => {
  describe('GET /cities', () => {
    it('should return all cities', async () => {
      const state = await createTestState(app, {
        name: 'Test State',
        countryId: '507f1f77bcf86cd799439011',
        region: 'Test Region',
        tagline: 'Test Tagline',
        description: 'Test Description',
        climate: 'Moderate'
      });

      const cityData = {
        name: 'Test City',
        stateId: state._id,
        overview: 'Test Overview',
        location: {
          lat: 12.34,
          long: 56.78
        }
      };

      await createTestCity(app, cityData);

      const response = await testRequest(app)
        .get('/cities')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe(cityData.name);
    });
  });

  describe('POST /cities', () => {
    it('should create a new city', async () => {
      const state = await createTestState(app, {
        name: 'Test State',
        countryId: '507f1f77bcf86cd799439011',
        region: 'Test Region',
        tagline: 'Test Tagline',
        description: 'Test Description',
        climate: 'Moderate'
      });

      const cityData = {
        name: 'Test City',
        stateId: state._id,
        overview: 'Test Overview',
        location: {
          lat: 12.34,
          long: 56.78
        }
      };

      const response = await testRequest(app)
        .post('/cities')
        .send(cityData)
        .expect(201);

      expect(response.body.name).toBe(cityData.name);
      expect(response.body.slug).toBe('test-city');
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await testRequest(app)
        .post('/cities')
        .send({})
        .expect(400);

      expect(response.body.message).toBe('Validation failed');
    });
  });

  describe('GET /cities/:id', () => {
    it('should return a city by id', async () => {
      const state = await createTestState(app, {
        name: 'Test State',
        countryId: '507f1f77bcf86cd799439011',
        region: 'Test Region',
        tagline: 'Test Tagline',
        description: 'Test Description',
        climate: 'Moderate'
      });

      const city = await createTestCity(app, {
        name: 'Test City',
        stateId: state._id,
        overview: 'Test Overview',
        location: {
          lat: 12.34,
          long: 56.78
        }
      });

      const response = await testRequest(app)
        .get(`/cities/${city._id}`)
        .expect(200);

      expect(response.body.name).toBe(city.name);
    });

    it('should return 404 if city not found', async () => {
      await testRequest(app)
        .get('/cities/507f1f77bcf86cd799439011')
        .expect(404);
    });
  });
});
