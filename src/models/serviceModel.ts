import mongoose, { Schema } from 'mongoose';
import { IService } from '../types/service.interface';

const serviceSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['transportation', 'accommodation', 'food', 'entertainment', 'healthcare', 'other']
    },
    provider: {
        name: String,
        contact: String,
        website: String
    },
    location: {
        address: String,
        coordinates: {
            latitude: Number,
            longitude: Number
        }
    },
    pricing: {
        currency: String,
        basePrice: Number,
        priceRange: String
    },
    availability: {
        days: [String],
        hours: String,
        isAlwaysOpen: Boolean
    },
    rating: {
        average: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        }
    },
    images: [String],
    tags: [String],
    cityId: {
        type: Schema.Types.ObjectId,
        ref: 'City',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model<IService>('Service', serviceSchema);
