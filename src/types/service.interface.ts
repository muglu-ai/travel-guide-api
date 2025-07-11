import { Document } from 'mongoose';

export interface IProvider {
  name: string;
  contact: string;
  website: string;
}

export interface IServiceLocation {
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface IPricing {
  currency: string;
  basePrice: number;
  priceRange: string;
}

export interface IAvailability {
  days: string[];
  hours: string;
  isAlwaysOpen: boolean;
}

export interface IRating {
  average: number;
  count: number;
}

export interface IService extends Document {
  name: string;
  description: string;
  category: 'transportation' | 'accommodation' | 'food' | 'entertainment' | 'healthcare' | 'other';
  provider: IProvider;
  location: IServiceLocation;
  pricing: IPricing;
  availability: IAvailability;
  rating: IRating;
  images: string[];
  tags: string[];
  cityId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
