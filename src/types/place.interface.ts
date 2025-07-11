import { Document } from 'mongoose';

export interface IEntryFee {
  adult: number;
  child: number;
  foreignNational: number;
}

export interface INearbyLocalEat {
  name: string;
  distanceKm: number;
}

export interface ILocation {
  lat: number;
  lng: number;
  address: string;
  neighborhood: string;
  nearbyLocalEats: INearbyLocalEat[];
}

export interface IAccessibility {
  wheelchairFriendly: boolean;
  familyFriendly: boolean;
  seniorFriendly: boolean;
}

export interface IPlace extends Document {
  name: string;
  slug: string;
  cityId: string;
  category: string;
  experienceTypes: string[];
  entryFee: IEntryFee;
  location: ILocation;
  accessibility: IAccessibility;
  timings: string;
  bestTimeToVisit: string;
  seasonalEvents: string[];
  visitorSentiments: string[];
  tips: string[];
  createdAt: Date;
  updatedAt: Date;
}
