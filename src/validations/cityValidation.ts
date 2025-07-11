import Joi from 'joi';

export const createCitySchema = Joi.object({
  name: Joi.string().required(),
  stateId: Joi.string().hex().length(24).required(),
  overview: Joi.string().required(),
  headline: Joi.string(),
  subheadline: Joi.string(),
  heroImageUrl: Joi.string().uri(),
  location: Joi.object({
    lat: Joi.number().required(),
    long: Joi.number().required()
  }).required(),
  localFood: Joi.array().items(Joi.string()),
  languagesSpoken: Joi.array().items(Joi.string()),
  emergencyHelpline: Joi.string(),
  bannerImage: Joi.string().uri(),
  about: Joi.object({
    content: Joi.string(),
    image: Joi.string().uri()
  }),
  services: Joi.array().items(Joi.string().hex().length(24)),
  weather: Joi.object({
    climate: Joi.string(),
    bestTimeToVisit: Joi.string(),
    averageTemperature: Joi.object({
      summer: Joi.number(),
      winter: Joi.number(),
      monsoon: Joi.number()
    })
  }),
  transportation: Joi.object({
    airports: Joi.array().items(Joi.string()),
    railwayStations: Joi.array().items(Joi.string()),
    busStations: Joi.array().items(Joi.string()),
    localTransport: Joi.array().items(Joi.string())
  }),
  tourism: Joi.object({
    attractions: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      type: Joi.string().required()
    })),
    activities: Joi.array().items(Joi.string()),
    events: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      date: Joi.string().required(),
      description: Joi.string().required()
    }))
  })
});

export const updateCitySchema = createCitySchema.fork(
  ['name', 'stateId', 'overview', 'location'],
  (schema) => schema.optional()
);
