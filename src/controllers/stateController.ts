import { RequestHandler } from 'express';
import asyncHandler from 'express-async-handler';
import State from '../models/stateModel';
import { IState } from '../types/state.interface';
import { TypedRequest, TypedRequestParams, TypedResponse } from '../types/express';
import { NotFoundError } from '../types/errors';
import Country from '../models/countryModel';

interface CreateStateBody extends Omit<IState, 'createdAt' | 'updatedAt' | '_id'> {}
interface UpdateStateBody extends Partial<CreateStateBody> {}

// Get all states
export const getAllStates: RequestHandler = asyncHandler(async (
    req,
    res
) => {
    const states = await State.find();
    const results = await Promise.all(states.map(async (state) => {
        const stateObj = (state.toObject() as any);
        const countryId = stateObj.country_id || stateObj.countryId;
        let countryName = null;
        if (countryId) {
            const country = await Country.findById(countryId);
            countryName = country ? country.name : null;
        }
        return {
            ...stateObj,
            location: {
                countryId,
                countryName
            }
        };
    }));
    res.json(results);
});

// Get state by ID
export const getStateById: RequestHandler = asyncHandler(async (
    req,
    res
) => {
    const state = await State.findById(req.params.id);
    if (!state) {
        throw new NotFoundError('State not found');
    }
    const stateObj = (state.toObject() as any);
    const countryId = stateObj.country_id || stateObj.countryId;
    let countryName = null;
    if (countryId) {
        const country = await Country.findById(countryId);
        countryName = country ? country.name : null;
    }
    const response = {
        ...stateObj,
        location: {
            countryId,
            countryName
        }
    };
    res.json(response);
});

// Create new state
export const createState: RequestHandler = asyncHandler(async (
    req: TypedRequest<CreateStateBody>,
    res: TypedResponse<IState>
) => {
    const state = await State.create({
        ...req.body,
        slug: req.body.name.toLowerCase().replace(/\s+/g, '-')
    });
    res.status(201).json(state);
});

// Update state
export const updateState: RequestHandler = asyncHandler(async (req, res) => {
    const state = await State.findById(req.params.id);
    if (!state) {
        res.status(404).json({ error: 'State not found' });
        return;
    }
    const updatedState = await State.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );
    if (!updatedState) {
        res.status(404).json({ error: 'State not found' });
        return;
    }
    res.json(updatedState);
});

// Delete state
export const deleteState: RequestHandler = asyncHandler(async (req, res) => {
    const state = await State.findById(req.params.id);
    if (!state) {
        res.status(404).json({ error: 'State not found' });
        return;
    }
    await State.findByIdAndDelete(req.params.id);
    res.json({ message: 'State removed' });
});

// Get states by region
export const getStatesByRegion: RequestHandler = asyncHandler(async (
    req,
    res
) => {
    const states = await State.find({ region: req.params.region });
    const results = await Promise.all(states.map(async (state) => {
        const stateObj = (state.toObject() as any);
        const countryId = stateObj.country_id || stateObj.countryId;
        let countryName = null;
        if (countryId) {
            const country = await Country.findById(countryId);
            countryName = country ? country.name : null;
        }
        return {
            ...stateObj,
            location: {
                countryId,
                countryName
            }
        };
    }));
    res.json(results);
});

// Get popular states
export const getPopularStates: RequestHandler = asyncHandler(async (
    _req,
    res
) => {
    const states = await State.find().sort({ popularityScore: -1 }).limit(10);
    const results = await Promise.all(states.map(async (state) => {
        const stateObj = (state.toObject() as any);
        const countryId = stateObj.country_id || stateObj.countryId;
        let countryName = null;
        if (countryId) {
            const country = await Country.findById(countryId);
            countryName = country ? country.name : null;
        }
        return {
            ...stateObj,
            location: {
                countryId,
                countryName
            }
        };
    }));
    res.json(results);
});

// Get state by slug
export const getStateBySlug: RequestHandler = asyncHandler(async (
    req,
    res
) => {
    const state = await State.findOne({ slug: req.params.slug });
    if (!state) {
        throw new NotFoundError('State not found');
    }
    const stateObj = (state.toObject() as any);
    const countryId = stateObj.country_id || stateObj.countryId;
    let countryName = null;
    if (countryId) {
        const country = await Country.findById(countryId);
        countryName = country ? country.name : null;
    }
    const response = {
        ...stateObj,
        location: {
            countryId,
            countryName
        }
    };
    res.json(response);
});

//get the country name based on the country id

// Get lightweight state info for home
export const getStatesHome: RequestHandler = asyncHandler(async (
    _req,
    res
) => {
    const states = await State.find({}, {
        _id: 1,
        name: 1,
        slug: 1,
        tagline: 1,
        region: 1,
        popularity_score: 1,
        banner_image: 1,
        labels: 1,
        country_id: 1,
        countryId: 1
    });
    const results = await Promise.all(states.map(async (state) => {
        const stateObj = (state.toObject() as any);
        const countryId = stateObj.country_id || stateObj.countryId;
        let countryName = null;
        if (countryId) {
            const country = await Country.findById(countryId);
            countryName = country ? country.name : null;
        }
        return {
            ...stateObj,
            location: {
                countryId,
                countryName
            }
        };
    }));
    res.json(results);
});

// Get states by labels (filter)
export const getStatesByLabels: RequestHandler = asyncHandler(async (
    req,
    res
) => {
    const labelsParam = req.query.labels;
    if (!labelsParam || typeof labelsParam !== 'string') {
        res.status(400).json({ error: 'labels query parameter is required and must be a comma-separated string.' });
        return;
    }
    const labels = labelsParam.split(',').map(l => l.trim()).filter(Boolean);
    if (labels.length === 0) {
        res.status(400).json({ error: 'At least one label must be provided.' });
        return;
    }
    const states = await State.find({ labels: { $in: labels } });
    const results = await Promise.all(states.map(async (state) => {
        const stateObj = (state.toObject() as any);
        const countryId = stateObj.country_id || stateObj.countryId;
        let countryName = null;
        if (countryId) {
            const country = await Country.findById(countryId);
            countryName = country ? country.name : null;
        }
        return {
            ...stateObj,
            location: {
                countryId,
                countryName
            }
        };
    }));
    res.json(results);
});
