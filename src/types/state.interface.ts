import { Document } from 'mongoose';

export interface IFestival {
  name: string;
  month: string;
  description: string;
}

export interface ICulture {
  languages: string[];
  festivals: IFestival[];
  cuisine: string[];
}

export interface IBestTimeToVisit {
  season: string;
  months: string[];
  description: string;
}

export interface ITransportation {
  airports: string[];
  railwayStations: string[];
  busStations: string[];
  localTransport: string[];
}

export interface IState extends Document {
  name: string;
  countryId: string;
  slug: string;
  tagline: string;
  region: string;
  popularityScore: number;
  cityCount: number;
  labels: string[];
  bannerImage?: string;
  description: string;
  climate: string;
  bestTimeToVisit: IBestTimeToVisit;
  culture: ICulture;
  transportation: ITransportation;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
