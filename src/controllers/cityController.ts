import { RequestHandler } from 'express';
import asyncHandler from 'express-async-handler';
import City from '../models/cityModel';
import State from '../models/stateModel';
import { ICity } from '../types/city.interface';
import { TypedRequest, TypedRequestParams, TypedResponse, TypedRequestQuery } from '../types/express';

interface CreateCityBody extends Omit<ICity, 'createdAt' | 'updatedAt' | '_id'> {}
interface UpdateCityBody extends Partial<CreateCityBody> {}

// Get all cities
export const getAllCities: RequestHandler = asyncHandler(async (
    req,
    res
) => {
    const cities = await City.find().populate('stateId');
    res.json(cities);
});

// Get city by ID
export const getCityById: RequestHandler = asyncHandler(async (req, res) => {
    const city = await City.findById(req.params.id);
    if (!city) {
        res.status(404).json({ error: 'City not found' });
        return;
    }
    res.json(city);
});

// Create new city
export const createCity: RequestHandler = asyncHandler(async (
    req,
    res
) => {
    const city = await City.create({
        ...req.body,
        slug: req.body.name.toLowerCase().replace(/\s+/g, '-')
    });
    res.status(201).json(city);
});

// Update city
export const updateCity: RequestHandler = asyncHandler(async (
    req,
    res
) => {
    const city = await City.findById(req.params.id);
    if (!city) {
        res.status(404).json({ error: 'City not found' });
        return;
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
    req,
    res
) => {
    const city = await City.findById(req.params.id);
    if (!city) {
        res.status(404).json({ error: 'City not found' });
        return;
    }

    await City.findByIdAndDelete(req.params.id);
    res.json({ message: 'City removed' });
});

// Get cities by state ID
export const getCitiesByStateId: RequestHandler = asyncHandler(async (
    req,
    res
) => {
    const cities = await City.find({ stateId: req.params.stateId });
    res.json(cities);
});

// Search cities by name
export const searchCitiesByName: RequestHandler = asyncHandler(async (
    req,
    res
) => {
    const cities = await City.find({
        name: { $regex: req.query.query, $options: 'i' }
    });
    res.json(cities);
});

// Get lightweight city info for home
export const getCitiesHome: RequestHandler = asyncHandler(async (
    _req,
    res
) => {
    // First get all cities with basic info
    const cities = await City.find({}, {
        _id: 1,
        slug: 1,
        name: 1,
        overview: 1
    }).lean();
    
    // Get all unique state IDs from the cities
    const stateIds = [...new Set(cities.map(city => city.stateId).filter(Boolean))];
    
    // Fetch all states in one query
    const states = await State.find({ _id: { $in: stateIds } }, { _id: 1, name: 1 }).lean();
    const stateMap = new Map(states.map(state => [state._id.toString(), state.name]));
    
    // Now get the full city data with all required fields using aggregation
    const citiesWithStateName = await City.aggregate([
        {
            $lookup: {
                from: 'states',
                localField: 'stateId',
                foreignField: '_id',
                as: 'state'
            }
        },
        {
            $unwind: {
                path: '$state',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 1,
                state_id: '$stateId',
                state_name: '$state.name',
                slug: 1,
                name: 1,
                overview: 1,
                banner_image: 1,
                labels: 1,
                rating: 1,
                tagline: 1,
                isActive: '$isActive'
            }
        }
    ]);
    
    // Transform the data to ensure consistent field names
    const transformedCities = citiesWithStateName.map(city => ({
        _id: city._id,
        state_id: city.state_id,
        state_name: city.state_name || 'Unknown State',
        slug: city.slug,
        name: city.name,
        overview: city.overview,
        banner_image: city.banner_image,
        labels: city.labels,
        rating: city.rating,
        tagline: city.tagline,
        isActive: city.isActive
    }));
    
    res.json(transformedCities);
});
