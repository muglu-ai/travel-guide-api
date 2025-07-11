import Joi from 'joi';

export const createStateSchema = Joi.object({
    name: Joi.string().required(),
    countryId: Joi.string().hex().length(24).required(),
    tagline: Joi.string().required(),
    region: Joi.string().required(),
    popularityScore: Joi.number().min(0).max(10),
    labels: Joi.array().items(Joi.string()),
    bannerImage: Joi.string().uri(),
    description: Joi.string().required(),
    climate: Joi.string().required(),
    bestTimeToVisit: Joi.object({
        season: Joi.string().required(),
        months: Joi.array().items(Joi.string()).required(),
        description: Joi.string().required()
    }),
    culture: Joi.object({
        languages: Joi.array().items(Joi.string()),
        festivals: Joi.array().items(Joi.object({
            name: Joi.string().required(),
            month: Joi.string().required(),
            description: Joi.string().required()
        })),
        cuisine: Joi.array().items(Joi.string())
    }),
    transportation: Joi.object({
        airports: Joi.array().items(Joi.string()),
        railwayStations: Joi.array().items(Joi.string()),
        busStations: Joi.array().items(Joi.string()),
        localTransport: Joi.array().items(Joi.string())
    }),
    isActive: Joi.boolean()
});

export const updateStateSchema = createStateSchema.fork(
    ['name', 'countryId', 'tagline', 'region', 'description', 'climate'],
    (schema) => schema.optional()
);
