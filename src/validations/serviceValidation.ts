import Joi from 'joi';

export const createServiceSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().valid(
    'transportation',
    'accommodation',
    'food',
    'entertainment',
    'healthcare',
    'other'
  ).required(),
  provider: Joi.object({
    name: Joi.string().required(),
    contact: Joi.string(),
    website: Joi.string().uri()
  }),
  location: Joi.object({
    address: Joi.string().required(),
    coordinates: Joi.object({
      latitude: Joi.number().required(),
      longitude: Joi.number().required()
    })
  }),
  pricing: Joi.object({
    currency: Joi.string().required(),
    basePrice: Joi.number(),
    priceRange: Joi.string()
  }),
  availability: Joi.object({
    days: Joi.array().items(Joi.string()),
    hours: Joi.string(),
    isAlwaysOpen: Joi.boolean()
  }),
  images: Joi.array().items(Joi.string().uri()),
  tags: Joi.array().items(Joi.string()),
  cityId: Joi.string().hex().length(24).required(),
  isActive: Joi.boolean()
});

export const updateServiceSchema = createServiceSchema.fork(
  ['name', 'description', 'category', 'cityId'],
  (schema) => schema.optional()
);
