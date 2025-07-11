import mongoose, { Schema } from 'mongoose';
import { IState } from '../types/state.interface';

const stateSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    countryId: { 
        type: Schema.Types.ObjectId, 
        required: true 
    },
    slug: { 
        type: String, 
        required: true, 
        unique: true 
    },
    tagline: { 
        type: String, 
        required: true 
    },
    region: { 
        type: String, 
        required: true 
    },
    popularityScore: { 
        type: Number, 
        min: 0, 
        max: 10,
        default: 0 
    },
    cityCount: { 
        type: Number, 
        default: 0 
    },
    labels: [String],
    bannerImage: String,
    description: {
        type: String,
        required: true
    },
    climate: {
        type: String,
        required: true
    },
    bestTimeToVisit: {
        season: String,
        months: [String],
        description: String
    },
    culture: {
        languages: [String],
        festivals: [{
            name: String,
            month: String,
            description: String
        }],
        cuisine: [String]
    },
    transportation: {
        airports: [String],
        railwayStations: [String],
        busStations: [String],
        localTransport: [String]
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model<IState>('State', stateSchema);
