import mongoose, { Schema } from 'mongoose';
import { IPlace } from '../types/place.interface';

const entryFeeSchema = new Schema({
    adult: { type: Number, required: true },
    child: { type: Number, required: true },
    foreignNational: { type: Number, required: true }
});

const locationSchema = new Schema({
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, required: true },
    neighborhood: { type: String },
    nearbyLocalEats: [{
        name: { type: String, required: true },
        distanceKm: { type: Number, required: true }
    }]
});

const nearbyAttractionSchema = new Schema({
    name: { type: String, required: true },
    distance: { type: Number, required: true },
    description: String
});

const suggestedItinerarySchema = new Schema({
    title: { type: String, required: true },
    duration: { type: String, required: true },
    activities: [String]
});

const placeSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    slug: { 
        type: String, 
        required: true, 
        unique: true 
    },
    cityId: { 
        type: Schema.Types.ObjectId, 
        required: true, 
        ref: 'City' 
    },
    description: {
        type: String,
        required: true
    },
    category: { 
        type: String, 
        required: true 
    },
    experienceTypes: [{
        type: String,
        required: true
    }],
    avgWaitTime: {
        type: Number,
        min: 0
    },
    durationToExplore: {
        type: String,
        required: true
    },
    entryFee: entryFeeSchema,
    internetAvailability: {
        type: Boolean,
        default: false
    },
    photos: [{
        type: String,
        required: true
    }],
    featuredImage: {
        type: String,
        required: true
    },
    rules: [String],
    location: locationSchema,
    accessibility: {
        wheelchairFriendly: Boolean,
        familyFriendly: Boolean,
        seniorFriendly: Boolean
    },
    bookingAvailable: {
        type: Boolean,
        default: false
    },
    localLegend: {
        type: String
    },
    nearbyAttractions: [nearbyAttractionSchema],
    suggestedItineraries: [suggestedItinerarySchema],
    tags: [String],
    topHighlights: [{
        type: String,
        required: true
    }],
    timings: {
        type: String,
        required: true
    },
    bestTimeToVisit: {
        type: String,
        required: true
    },
    seasonalEvents: [{
        type: String
    }],
    visitorSentiments: [{
        type: String
    }],
    tips: [{
        type: String
    }]
}, {
    timestamps: true
});

// Create indexes for frequently queried fields
placeSchema.index({ cityId: 1 });
placeSchema.index({ slug: 1 });
placeSchema.index({ category: 1 });
placeSchema.index({ tags: 1 });

const PlaceModel = mongoose.model<IPlace>('Place', placeSchema, 'places_to_visit');
export default PlaceModel;
