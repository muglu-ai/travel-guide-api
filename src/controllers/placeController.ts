import { RequestHandler } from 'express';
import asyncHandler from 'express-async-handler';
import Place from '../models/placeModel';
import { IPlace } from '../types/place.interface';
import { TypedRequest, TypedRequestParams, TypedResponse, TypedRequestQuery } from '../types/express';
import { NotFoundError } from '../types/errors';
import { Request, Response } from 'express';

interface CreatePlaceBody extends Omit<IPlace, 'createdAt' | 'updatedAt' | '_id'> {}
interface UpdatePlaceBody extends Partial<CreatePlaceBody> {}

// Get all places
export const getAllPlaces: RequestHandler = asyncHandler(async (
    req: TypedRequest,
    res: TypedResponse<IPlace[]>
) => {
    const places = await Place.find().populate('cityId');
    res.json(places);
});

// Get place by ID
export const getPlaceById: RequestHandler = asyncHandler(async (
    req: TypedRequestParams<{ id: string }>,
    res: TypedResponse<IPlace>
) => {
    const place = await Place.findById(req.params.id).populate('cityId');
    if (!place) {
        throw new NotFoundError('Place not found');
    }
    res.json(place);
});

// Create new place
export const createPlace: RequestHandler = asyncHandler(async (
    req: TypedRequest<CreatePlaceBody>,
    res: TypedResponse<IPlace>
) => {
    const place = await Place.create({
        ...req.body,
        slug: req.body.name.toLowerCase().replace(/\s+/g, '-')
    });
    res.status(201).json(place);
});

// Update place
export const updatePlace: RequestHandler = asyncHandler(async (
    req: TypedRequest<UpdatePlaceBody> & TypedRequestParams<{ id: string }>,
    res: TypedResponse<IPlace>
) => {
    const place = await Place.findById(req.params.id);
    if (!place) {
        throw new NotFoundError('Place not found');
    }

    const updatedPlace = await Place.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.json(updatedPlace);
});

// Delete place
export const deletePlace: RequestHandler = asyncHandler(async (
    req: TypedRequestParams<{ id: string }>,
    res: TypedResponse<{ message: string }>
) => {
    const place = await Place.findById(req.params.id);
    if (!place) {
        throw new NotFoundError('Place not found');
    }

    await Place.findByIdAndDelete(req.params.id);
    res.json({ message: 'Place removed' });
});

// Get places by city ID
export const getPlacesByCityId: RequestHandler = asyncHandler(async (
    req: TypedRequestParams<{ cityId: string }>,
    res: TypedResponse<IPlace[]>
) => {
    const places = await Place.find({ cityId: req.params.cityId });
    res.json(places);
});

// Get places by category
export const getPlacesByCategory: RequestHandler = asyncHandler(async (
    req: TypedRequestParams<{ category: string }>,
    res: TypedResponse<IPlace[]>
) => {
    const places = await Place.find({ category: req.params.category });
    res.json(places);
});

// Search places by name
export const searchPlacesByName: RequestHandler = asyncHandler(async (
    req: TypedRequestQuery<{ query: string }>,
    res: TypedResponse<IPlace[]>
) => {
    const places = await Place.find({
        name: { $regex: req.query.query, $options: 'i' }
    });
    res.json(places);
});

// Get places by tags
export const getPlacesByTags: RequestHandler = asyncHandler(async (
    req: TypedRequestQuery<{ tags?: string }>,
    res: TypedResponse<IPlace[]>
) => {
    try {
        const tagsParam = req.query.tags;
        if (!tagsParam) {
            return res.status(400).json({ 
                status: 'error',
                message: 'Tags parameter is required' 
            });
        }
        
        const tags = tagsParam.split(',').map(tag => tag.trim());
        
        // Basic validation of tags
        if (tags.length === 0 || tags.some(tag => !tag)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid tags provided'
            });
        }

        const places = await Place.find({
            tags: { 
                $in: tags
            }
        })
        .populate({
            path: 'cityId',
            select: 'name region state' // Specify the fields you want from the city
        })
        .select('-__v'); // Exclude the version key

        if (!places || places.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: `No places found with tags: ${tags.join(', ')}`
            });
        }

        return res.json({
            status: 'success',
            count: places.length,
            data: places
        });
    } catch (error) {
        console.error('Error in getPlacesByTags:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error fetching places by tags',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
