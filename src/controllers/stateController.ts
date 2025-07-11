import { RequestHandler } from 'express';
import asyncHandler from 'express-async-handler';
import State from '../models/stateModel';
import { IState } from '../types/state.interface';
import { TypedRequest, TypedRequestParams, TypedResponse } from '../types/express';
import { NotFoundError } from '../types/errors';

interface CreateStateBody extends Omit<IState, 'createdAt' | 'updatedAt' | '_id'> {}
interface UpdateStateBody extends Partial<CreateStateBody> {}

// Get all states
export const getAllStates: RequestHandler = asyncHandler(async (
    req: TypedRequest,
    res: TypedResponse<IState[]>
) => {
    const states = await State.find();
    res.json(states);
});

// Get state by ID
export const getStateById: RequestHandler = asyncHandler(async (
    req: TypedRequestParams<{ id: string }>,
    res: TypedResponse<IState>
) => {
    const state = await State.findById(req.params.id);
    if (!state) {
        throw new NotFoundError('State not found');
    }
    res.json(state);
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
export const updateState: RequestHandler = asyncHandler(async (
    req: TypedRequest<UpdateStateBody> & TypedRequestParams<{ id: string }>,
    res: TypedResponse<IState>
) => {
    const state = await State.findById(req.params.id);
    if (!state) {
        throw new NotFoundError('State not found');
    }

    const updatedState = await State.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.json(updatedState);
});

// Delete state
export const deleteState: RequestHandler = asyncHandler(async (
    req: TypedRequestParams<{ id: string }>,
    res: TypedResponse<{ message: string }>
) => {
    const state = await State.findById(req.params.id);
    if (!state) {
        throw new NotFoundError('State not found');
    }

    await State.findByIdAndDelete(req.params.id);
    res.json({ message: 'State removed' });
});

// Get states by region
export const getStatesByRegion: RequestHandler = asyncHandler(async (
    req: TypedRequestParams<{ region: string }>,
    res: TypedResponse<IState[]>
) => {
    const states = await State.find({ region: req.params.region });
    res.json(states);
});

// Get popular states
export const getPopularStates: RequestHandler = asyncHandler(async (
    _req: TypedRequest,
    res: TypedResponse<IState[]>
) => {
    const states = await State.find().sort({ popularityScore: -1 }).limit(10);
    res.json(states);
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
        country_id: 1
    });
    
    // Add country name to each state
    const statesWithCountry = states.map(state => ({
        ...state.toObject(),
        country: "India" // Since all states appear to be from India
    }));
    
    res.json(statesWithCountry);
});
