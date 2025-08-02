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
    req,
    res
) => {
    const places = await Place.find({}, {
        _id: 1,
        name: 1,
        slug: 1,
        description: 1,
        photos: 1,
        featuredImage: 1,
        durationToExplore: 1,
        avgWaitTime: 1,
        entryFee: 1,
        experienceTypes: 1,
        accessibility: 1,
        timings: 1,
        rules: 1,
        location: 1,
        tips: 1,
        tags: 1,
        state_ids: 1,
        city_ids: 1,
        stateIds: 1,
        cityIds: 1
    })
    .populate({ path: 'state_ids', select: 'name slug' })
    .populate({ path: 'city_ids', select: 'name slug' });
    res.json(places);
});

// Get place by ID
export const getPlaceById: RequestHandler = asyncHandler(async (req, res) => {
    const place = await Place.findById(req.params.id, {
        _id: 1,
        name: 1,
        slug: 1,
        description: 1,
        photos: 1,
        featuredImage: 1,
        durationToExplore: 1,
        avgWaitTime: 1,
        entryFee: 1,
        experienceTypes: 1,
        accessibility: 1,
        timings: 1,
        rules: 1,
        location: 1,
        tips: 1,
        tags: 1,
        state_ids: 1,
        city_ids: 1,
        stateIds: 1,
        cityIds: 1
    })
    .populate({ path: 'state_ids', select: 'name slug' })
    .populate({ path: 'city_ids', select: 'name slug' });
    if (!place) {
        res.status(404).json({ error: 'Place not found' });
        return;
    }
    res.json(place);
});

// Create new place
export const createPlace: RequestHandler = asyncHandler(async (req, res) => {
    const place = await Place.create({
        ...req.body,
        slug: req.body.name.toLowerCase().replace(/\s+/g, '-')
    });
    res.status(201).json(place);
});

// Update place
export const updatePlace: RequestHandler = asyncHandler(async (req, res) => {
    const place = await Place.findById(req.params.id);
    if (!place) {
        res.status(404).json({ error: 'Place not found' });
        return;
    }
    const updatedPlace = await Place.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );
    if (!updatedPlace) {
        res.status(404).json({ error: 'Place not found' });
        return;
    }
    res.json(updatedPlace);
});

// Delete place
export const deletePlace: RequestHandler = asyncHandler(async (req, res) => {
    const place = await Place.findById(req.params.id);
    if (!place) {
        res.status(404).json({ error: 'Place not found' });
        return;
    }
    await Place.findByIdAndDelete(req.params.id);
    res.json({ message: 'Place removed' });
});

// Get places by city ID
export const getPlacesByCityId: RequestHandler = asyncHandler(async (req, res) => {
    const places = await Place.find({ cityId: req.params.cityId }, {
        _id: 1,
        name: 1,
        slug: 1,
        description: 1,
        photos: 1,
        featuredImage: 1,
        durationToExplore: 1,
        avgWaitTime: 1,
        entryFee: 1,
        experienceTypes: 1,
        accessibility: 1,
        timings: 1,
        rules: 1,
        location: 1,
        tips: 1,
        tags: 1,
        state_ids: 1,
        city_ids: 1,
        stateIds: 1,
        cityIds: 1
    })
    .populate({ path: 'state_ids', select: 'name slug' })
    .populate({ path: 'city_ids', select: 'name slug' });
    res.json(places);
});

// Get places by category
export const getPlacesByCategory: RequestHandler = asyncHandler(async (req, res) => {
    const places = await Place.find({ category: req.params.category }, {
        _id: 1,
        name: 1,
        slug: 1,
        description: 1,
        photos: 1,
        featuredImage: 1,
        durationToExplore: 1,
        avgWaitTime: 1,
        entryFee: 1,
        experienceTypes: 1,
        accessibility: 1,
        timings: 1,
        rules: 1,
        location: 1,
        tips: 1,
        tags: 1,
        state_ids: 1,
        city_ids: 1,
        stateIds: 1,
        cityIds: 1
    })
    .populate({ path: 'state_ids', select: 'name slug' })
    .populate({ path: 'city_ids', select: 'name slug' });
    res.json(places);
});

// Search places by name
export const searchPlacesByName: RequestHandler = asyncHandler(async (req, res) => {
    const places = await Place.find({
        name: { $regex: req.query.query, $options: 'i' }
    }, {
        _id: 1,
        name: 1,
        slug: 1,
        description: 1,
        photos: 1,
        featuredImage: 1,
        durationToExplore: 1,
        avgWaitTime: 1,
        entryFee: 1,
        experienceTypes: 1,
        accessibility: 1,
        timings: 1,
        rules: 1,
        location: 1,
        tips: 1,
        tags: 1,
        state_ids: 1,
        city_ids: 1,
        stateIds: 1,
        cityIds: 1
    })
    .populate({ path: 'state_ids', select: 'name slug' })
    .populate({ path: 'city_ids', select: 'name slug' });
    res.json(places);
});

// Get places by tags
export const getPlacesByTags: RequestHandler = asyncHandler(async (req, res) => {
    const tagsParam = req.query.tags;
    let tags: string[] = [];
    if (typeof tagsParam === 'string') {
        tags = tagsParam.split(',').map((tag: string) => tag.trim());
    }
    if (tags.length === 0 || tags.some((tag: string) => !tag)) {
        res.status(400).json({ error: 'At least one valid tag must be provided.' });
        return;
    }
    const places = await Place.find({ tags: { $in: tags } }, {
        _id: 1,
        name: 1,
        slug: 1,
        description: 1,
        photos: 1,
        featuredImage: 1,
        durationToExplore: 1,
        avgWaitTime: 1,
        entryFee: 1,
        experienceTypes: 1,
        accessibility: 1,
        timings: 1,
        rules: 1,
        location: 1,
        tips: 1,
        tags: 1,
        state_ids: 1,
        city_ids: 1,
        stateIds: 1,
        cityIds: 1
    })
    .populate({ path: 'state_ids', select: 'name slug' })
    .populate({ path: 'city_ids', select: 'name slug' });
    res.json(places);
});
