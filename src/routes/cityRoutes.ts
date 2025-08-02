import { Router } from 'express';
import * as cityController from '../controllers/cityController';
import { validateRequest } from '../middleware/validation';
import { createCitySchema, updateCitySchema } from '../validations/cityValidation';

const router = Router();

// GET lightweight cities for home
router.get('/home', cityController.getCitiesHome);

// GET all cities
router.get('/', cityController.getAllCities);

// GET cities by labels (must be above /:id)
router.get('/labels/:labels', cityController.getCitiesByLabels);

// GET city by ID
router.get('/:id', cityController.getCityById);

// POST create new city
router.post('/', validateRequest(createCitySchema), cityController.createCity);

// PUT update city
router.put('/:id', validateRequest(updateCitySchema), cityController.updateCity);

// DELETE city
router.delete('/:id', cityController.deleteCity);

// GET cities by state ID
router.get('/state/:stateId', cityController.getCitiesByStateId);

// GET cities by name
router.get('/search', cityController.searchCitiesByName);

export default router;
