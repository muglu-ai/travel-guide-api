import { RequestHandler } from 'express';
import asyncHandler from 'express-async-handler';
import City from '../models/cityModel';
import { ICity } from '../types/city.interface';
import { TypedRequest, TypedRequestParams, TypedResponse, TypedRequestQuery } from '../types/express';

interface CreateCityBody extends Omit<ICity, 'createdAt' | 'updatedAt' | '_id'> {}
interface UpdateCityBody extends Partial<CreateCityBody> {}

// Get all cities
export const getAllCities: RequestHandler = asyncHandler(async (
    req: TypedRequest,
    res: TypedResponse<ICity[]>
) => {
    const cities = await City.find().populate('stateId');
    res.json(cities);
});

// Get city by ID
export const getCityById: RequestHandler = asyncHandler(async (
    req: TypedRequestParams<{ id: string }>,
    res: TypedResponse<ICity>
) => {
    const city = await City.findById(req.params.id).populate('stateId');
    if (!city) {
        res.status(404);
        throw new Error('City not found');
    }
    res.json(city);
});

// Create new city
export const createCity: RequestHandler = asyncHandler(async (
    req: TypedRequest<CreateCityBody>,
    res: TypedResponse<ICity>
) => {
    const city = await City.create({
        ...req.body,
        slug: req.body.name.toLowerCase().replace(/\s+/g, '-')
    });
    res.status(201).json(city);
});

// Update city
export const updateCity: RequestHandler = asyncHandler(async (
    req: TypedRequest<UpdateCityBody> & TypedRequestParams<{ id: string }>,
    res: TypedResponse<ICity>
) => {
    const city = await City.findById(req.params.id);
    if (!city) {
        res.status(404);
        throw new Error('City not found');
    }

    const updatedCity = await City.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.json(updatedCity);
});

// Delete city
export const deleteCity: RequestHandler = asyncHandler(async (
    req: TypedRequestParams<{ id: string }>,
    res: TypedResponse<{ message: string }>
) => {
    const city = await City.findById(req.params.id);
    if (!city) {
        res.status(404);
        throw new Error('City not found');
    }

    await City.findByIdAndDelete(req.params.id);
    res.json({ message: 'City removed' });
});

// Get cities by state ID
export const getCitiesByStateId: RequestHandler = asyncHandler(async (
    req: TypedRequestParams<{ stateId: string }>,
    res: TypedResponse<ICity[]>
) => {
    const cities = await City.find({ stateId: req.params.stateId });
    res.json(cities);
});

// Search cities by name
export const searchCitiesByName: RequestHandler = asyncHandler(async (
    req: TypedRequestQuery<{ query: string }>,
    res: TypedResponse<ICity[]>
) => {
    const cities = await City.find({
        name: { $regex: req.query.query, $options: 'i' }
    });
    res.json(cities);
});
