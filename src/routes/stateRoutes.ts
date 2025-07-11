import { Router } from 'express';
import * as stateController from '../controllers/stateController';
import { validateRequest } from '../middleware/validation';
import { createStateSchema, updateStateSchema } from '../validations/stateValidation';

const router = Router();

// GET lightweight states for home
router.get('/home', stateController.getStatesHome);

// GET all states
router.get('/', stateController.getAllStates);

// GET state by ID
router.get('/:id', stateController.getStateById);

// POST create new state
router.post('/', validateRequest(createStateSchema), stateController.createState);

// PUT update state
router.put('/:id', validateRequest(updateStateSchema), stateController.updateState);

// DELETE state
router.delete('/:id', stateController.deleteState);

// GET states by region
router.get('/region/:region', stateController.getStatesByRegion);

// GET states by popularity
router.get('/popular', stateController.getPopularStates);

export default router;
