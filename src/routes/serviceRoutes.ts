import { Router } from 'express';
import * as serviceController from '../controllers/serviceController';

const router = Router();

// Create a new service
router.post('/', serviceController.createService);

// Get all services
router.get('/', serviceController.getAllServices);

// Get a service by ID
router.get('/:id', serviceController.getServiceById);

// Update a service by ID
router.put('/:id', serviceController.updateService);

// Delete a service by ID
router.delete('/:id', serviceController.deleteService);

export default router;
