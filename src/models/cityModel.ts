import mongoose, { Schema } from 'mongoose';
import { ICity } from '../types/city.interface';

const aboutSchema = new Schema({
    content: String,
    image: String
});

const citySchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    stateId: { 
        type: Schema.Types.ObjectId, 
        required: true, 
        ref: 'State' 
    },
    slug: { 
        type: String, 
        required: true, 
        unique: true 
    },
    overview: { 
        type: String, 
        required: true 
    },
    headline: String,
    subheadline: String,
    heroImageUrl: String,
    location: {
        lat: { type: Number, required: true },
        long: { type: Number, required: true }
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    localFood: [String],
    languagesSpoken: [String],
    emergencyHelpline: String,
    bannerImage: String,
    about: aboutSchema,
    services: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Service' 
    }],
    weather: {
        climate: String,
        bestTimeToVisit: String,
        averageTemperature: {
            summer: Number,
            winter: Number,
            monsoon: Number
        }
    },
    transportation: {
        airports: [String],
        railwayStations: [String],
        busStations: [String],
        localTransport: [String]
    },
    tourism: {
        attractions: [{
            name: String,
            description: String,
            type: String
        }],
        activities: [String],
        events: [{
            name: String,
            date: String,
            description: String
        }]
    }
}, {
    timestamps: true
});

export default mongoose.model<ICity>('City', citySchema);
