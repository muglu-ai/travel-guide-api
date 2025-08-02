import mongoose, { Schema } from 'mongoose';
import { IPlace } from '../types/place.interface';

const placeSchema = new Schema({    
    state_ids: [{ type: Schema.Types.ObjectId, ref: 'State', required: false }],
    city_ids: [{ type: Schema.Types.ObjectId, ref: 'City', required: false }],
    name: { type: String, required: true },
    slug: { type: String },
    category: { type: String },
    experienceTypes: [{ type: String }],
    entryFee: [{ type: String }],
    location: [{ type: String }],
    accessibility: [{ type: String }],
    timings: { type: String },
    bestTimeToVisit: { type: String },
    bestMonthToVisit: { type: String },
    seasonalEvents: [{ type: String }],
    visitorSentiments: [{ type: String }],
    tips: [{ type: String }],
    bookingAvailable: { type: Boolean },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    description: { type: String },
    featuredImage: { type: String },
    localLegend: { type: String },
    photos: [{ type: String }],
    difficultLevel: [{ type: String }],
    duration: { type: String }
}, {
    timestamps: false
});

export default mongoose.model<IPlace>('Place', placeSchema, 'places');
