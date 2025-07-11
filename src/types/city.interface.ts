import { Document } from 'mongoose';

export interface ILocation {
  lat: number;
  long: number;
}

export interface IAbout {
  content: string;
  image: string;
}

export interface IWeather {
  climate: string;
  bestTimeToVisit: string;
  averageTemperature: {
    summer: number;
    winter: number;
    monsoon: number;
  };
}

export interface ITransportation {
  airports: string[];
  railwayStations: string[];
  busStations: string[];
  localTransport: string[];
}

export interface ITourismAttraction {
  name: string;
  description: string;
  type: string;
}

export interface ITourismEvent {
  name: string;
  date: string;
  description: string;
}

export interface ITourism {
  attractions: ITourismAttraction[];
  activities: string[];
  events: ITourismEvent[];
}

export interface ICity extends Document {
  name: string;
  stateId: string;
  slug: string;
  overview: string;
  headline?: string;
  subheadline?: string;
  heroImageUrl?: string;
  location: ILocation;
  isActive: boolean;
  localFood: string[];
  languagesSpoken: string[];
  emergencyHelpline?: string;
  bannerImage?: string;
  about?: IAbout;
  services: string[];
  weather: IWeather;
  transportation: ITransportation;
  tourism: ITourism;
  createdAt: Date;
  updatedAt: Date;
}
