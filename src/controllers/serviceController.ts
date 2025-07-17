import { RequestHandler } from 'express';
import asyncHandler from 'express-async-handler';
import Service from '../models/serviceModel';
import { IService } from '../types/service.interface';
import { TypedRequest, TypedRequestParams, TypedResponse } from '../types/express';
import { NotFoundError } from '../types/errors';

interface CreateServiceBody extends Omit<IService, 'createdAt' | 'updatedAt' | '_id'> {}
interface UpdateServiceBody extends Partial<CreateServiceBody> {}

// Create a new service
export const createService: RequestHandler = asyncHandler(async (
    req: TypedRequest<CreateServiceBody>,
    res: TypedResponse<IService>
) => {
    const service = await Service.create(req.body);
    res.status(201).json(service);
});

// Get all services
export const getAllServices: RequestHandler = asyncHandler(async (
    _req: TypedRequest,
    res: TypedResponse<IService[]>
) => {
    const services = await Service.find();
    res.json(services);
});

// Get a service by ID
export const getServiceById: RequestHandler = asyncHandler(async (req, res) => {
    const service = await Service.findById(req.params.id);
    if (!service) {
        res.status(404).json({ error: 'Service not found' });
        return;
    }
    res.json(service);
});

// Update service
export const updateService: RequestHandler = asyncHandler(async (req, res) => {
    const service = await Service.findById(req.params.id);
    if (!service) {
        res.status(404).json({ error: 'Service not found' });
        return;
    }
    const updatedService = await Service.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );
    if (!updatedService) {
        res.status(404).json({ error: 'Service not found' });
        return;
    }
    res.json(updatedService);
});

// Delete service
export const deleteService: RequestHandler = asyncHandler(async (req, res) => {
    const service = await Service.findById(req.params.id);
    if (!service) {
        res.status(404).json({ error: 'Service not found' });
        return;
    }
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service removed' });
});
