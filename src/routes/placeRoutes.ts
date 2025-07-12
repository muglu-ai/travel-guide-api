import { Router } from 'express';
import * as placeController from '../controllers/placeController';

const router = Router();

// GET all places
router.get('/', placeController.getAllPlaces);

// GET place by ID
router.get('/:id', placeController.getPlaceById);

// POST create new place
router.post('/', placeController.createPlace);

// PUT update place
router.put('/:id', placeController.updatePlace);

// DELETE place
router.delete('/:id', placeController.deletePlace);

// GET places by city ID
router.get('/city/:cityId', placeController.getPlacesByCityId);

// GET places by category
router.get('/category/:category', placeController.getPlacesByCategory);

// Search places by name
router.get('/search', placeController.searchPlacesByName);

// GET places by tags
router.get('/tags', placeController.getPlacesByTags);

export default router;
