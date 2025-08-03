import { RequestHandler } from 'express';
import asyncHandler from 'express-async-handler';
import City from '../models/cityModel';
import State from '../models/stateModel';
import { ICity } from '../types/city.interface';

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
    const city = await City.findById(req.params.id)
        .populate({
            path: 'stateId',
            select: 'name countryId',
            populate: { path: 'countryId', select: 'name' }
        });
    if (!city) {
        res.status(404).json({ error: 'City not found' });
        return;
    }
    const state: any = city.stateId && typeof city.stateId === 'object' ? city.stateId : null;
    const country: any = state && state.countryId && typeof state.countryId === 'object' ? state.countryId : null;
    res.json({
        _id: city._id,
        name: city.name,
        slug: city.slug,
        overview: city.overview,
        headline: city.headline,
        subheadline: city.subheadline,
        heroImageUrl: city.heroImageUrl,
        location: city.location,
        isActive: city.isActive,
        localFood: city.localFood,
        languagesSpoken: city.languagesSpoken,
        emergencyHelpline: city.emergencyHelpline,
        bannerImage: city.bannerImage,
        about: city.about,
        locationInfo: {
            stateId: state ? state._id : null,
            stateName: state ? state.name : null,
            countryId: country ? country._id : null,
            countryName: country ? country.name : null
        },
        createdAt: city.createdAt,
        updatedAt: city.updatedAt
    });
});

// Create new city
export const createCity: RequestHandler = asyncHandler(async (req, res) => {
    const city = await City.create({
        ...req.body,
        slug: req.body.name.toLowerCase().replace(/\s+/g, '-')
    });
    res.status(201).json(city);
});

// Update city
export const updateCity: RequestHandler = asyncHandler(async (req, res) => {
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
export const deleteCity: RequestHandler = asyncHandler(async (req, res) => {
    const city = await City.findById(req.params.id);
    if (!city) {
        res.status(404).json({ error: 'City not found' });
        return;
    }
    await City.findByIdAndDelete(req.params.id);
    res.json({ message: 'City removed' });
});

// Get cities by state ID
export const getCitiesByStateId: RequestHandler = asyncHandler(async (req, res) => {
    const cities = await City.find({ stateId: req.params.stateId });
    res.json(cities);
});

// Search cities by name
export const searchCitiesByName: RequestHandler = asyncHandler(async (req, res) => {
    const cities = await City.find({
        name: { $regex: req.query.query, $options: 'i' }
    });
    res.json(cities);
});

// Get lightweight city info for home
export const getCitiesHome: RequestHandler = asyncHandler(async (_req, res) => {
    const cities = await City.find({}, {
        _id: 1,
        slug: 1,
        name: 1,
        overview: 1,
        bannerImage: 1,
        isActive: 1,
        stateId: 1
    }).lean();
    const stateIds = [...new Set(cities.map(city => city.stateId?.toString()).filter(Boolean))];
    const states = await State.find({ _id: { $in: stateIds } }, { _id: 1, name: 1 }).lean();
    const stateMap = new Map(states.map(state => [state._id.toString(), state.name]));
    const transformedCities = cities.map(city => ({
        _id: city._id,
        stateId: city.stateId,
        state_name: stateMap.get(city.stateId?.toString()) || 'Unknown State',
        slug: city.slug,
        name: city.name,
        overview: city.overview,
        bannerImage: city.bannerImage,
        isActive: city.isActive
    }));
    res.json(transformedCities);
});

// Get cities by labels
export const getCitiesByLabels: RequestHandler = asyncHandler(async (req, res) => {
    const labelsParam = req.params.labels;
    if (!labelsParam || typeof labelsParam !== 'string') {
        res.status(400).json({ error: 'labels parameter is required and must be a comma-separated string.' });
        return;
    }
    const labels = labelsParam.split(',').map(l => l.trim()).filter(Boolean);
    if (labels.length === 0) {
        res.status(400).json({ error: 'At least one label must be provided.' });
        return;
    }
    // Find cities with any of the given labels, populate state and services
    const cities = await City.find({ labels: { $in: labels } })
        .populate({
            path: 'state_id',
            select: 'name country_id',
            populate: { path: 'country_id', select: 'name' }
        })
        .populate({
            path: 'services',
            select: 'name _id'
        });

    // Format the response
    const result = cities.map(city => {
        let state = city.state_id || city.stateId;
        let country = state && (state.country_id || state.countryId);
        return {
            _id: city._id,
            name: city.name,
            slug: city.slug,
            overview: city.overview,
            headline: city.headline,
            subheadline: city.subheadline,
            heroImageUrl: city.heroImageUrl,
            location: city.location,
            isActive: city.isActive,
            localFood: city.localFood,
            languagesSpoken: city.languagesSpoken,
            emergencyHelpline: city.emergencyHelpline,
            bannerImage: city.bannerImage,
            about: city.about,
            labels: city.labels,
            rating: city.rating,
            tagline: city.tagline,
            services: city.services.map(service => ({ _id: service._id, name: service.name })),
            locationInfo: {
                stateId: state ? state._id : null,
                stateName: state ? state.name : null,
                countryId: country ? country._id : null,
                countryName: country ? country.name : null
            },
            createdAt: city.createdAt,
            updatedAt: city.updatedAt
        };
    });
    res.json(result);
});
