import mongoose, { Schema } from 'mongoose';
import { IPlace } from '../types/place.interface';

const entryFeeSchema = new Schema({
    adult: Number,
    child: Number,
    foreignNational: Number
});

const locationSchema = new Schema({
    lat: Number,
    lng: Number,
    address: String,
    neighborhood: String,
    nearbyLocalEats: [{
        name: String,
        distanceKm: Number
    }]
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
    category: { 
        type: String, 
        required: true 
    },
    experienceTypes: [String],
    entryFee: entryFeeSchema,
    location: locationSchema,
    accessibility: {
        wheelchairFriendly: Boolean,
        familyFriendly: Boolean,
        seniorFriendly: Boolean
    },
    timings: String,
    bestTimeToVisit: String,
    seasonalEvents: [String],
    visitorSentiments: [String],
    tips: [String]
}, {
    timestamps: true
});

export default mongoose.model<IPlace>('Place', placeSchema);
