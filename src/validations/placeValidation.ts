import Joi from 'joi';

export const createPlaceSchema = Joi.object({
  name: Joi.string().required(),
  cityId: Joi.string().hex().length(24).required(),
  category: Joi.string().required(),
  experienceTypes: Joi.array().items(Joi.string()),
  entryFee: Joi.object({
    adult: Joi.number(),
    child: Joi.number(),
    foreignNational: Joi.number()
  }),
  location: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
    address: Joi.string().required(),
    neighborhood: Joi.string(),
    nearbyLocalEats: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      distanceKm: Joi.number().required()
    }))
  }).required(),
  accessibility: Joi.object({
    wheelchairFriendly: Joi.boolean(),
    familyFriendly: Joi.boolean(),
    seniorFriendly: Joi.boolean()
  }),
  timings: Joi.string(),
  bestTimeToVisit: Joi.string(),
  seasonalEvents: Joi.array().items(Joi.string()),
  visitorSentiments: Joi.array().items(Joi.string()),
  tips: Joi.array().items(Joi.string())
});

export const updatePlaceSchema = createPlaceSchema.fork(
  ['name', 'cityId', 'category', 'location'],
  (schema) => schema.optional()
);
