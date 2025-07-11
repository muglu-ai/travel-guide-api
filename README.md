# Migration Guide: FastAPI to Node.js

This document outlines the steps and considerations for migrating the Travel Guide API from FastAPI (Python) to Node.js.

## Project Structure Mapping

### Current FastAPI Structure
```
/appconfig/
  - database.py     # MongoDB connection and config
  - settings.py     # Environment settings
  - db_updates.py   # Data seeding and updates
/approuters/
  - base.py        # Basic routes and health checks
  - cities.py      # City management
  - places.py      # Places to visit
  - services.py    # City services
  - states.py      # State management
  - models.py      # Pydantic models
/appschemas/       # Data validation
/appservices/      # Business logic
```

### Proposed Node.js Structure
```
/src
  /config
    - database.js    # MongoDB connection setup
    - env.js         # Environment configuration
  /models
    - cityModel.js   # Mongoose schemas
    - placeModel.js
    - serviceModel.js
    - stateModel.js
  /routes
    - baseRoutes.js  # Express routes
    - cityRoutes.js
    - placeRoutes.js
    - serviceRoutes.js
    - stateRoutes.js
  /controllers
    - cityController.js  # Business logic
    - placeController.js
    - serviceController.js
    - stateController.js
  /middleware
    - auth.js        # Authentication middleware
    - validation.js  # Request validation
  /utils
    - seeder.js      # Data seeding utilities
    - helpers.js     # Common helper functions
  - app.js           # Express app setup
  - server.js        # Server entry point
```

## Dependencies Migration

### FastAPI Dependencies to Node.js Equivalents
```
FastAPI             →  Express.js
Pydantic           →  Joi/Yup
Motor (MongoDB)     →  Mongoose
python-dotenv      →  dotenv
uvicorn            →  N/A (built into Node.js)
```

### Required Node.js Packages
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "joi": "^17.9.0",
    "dotenv": "^16.0.0",
    "cors": "^2.8.5",
    "express-async-handler": "^1.2.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.22",
    "jest": "^29.0.0"
  }
}
```

## Data Models Migration

### State Model
```javascript
// models/stateModel.js
const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  countryId: { type: mongoose.Schema.Types.ObjectId, required: true },
  slug: { type: String, required: true, unique: true },
  tagline: { type: String, required: true },
  region: { type: String, required: true },
  popularityScore: { type: Number, min: 0, max: 10 },
  cityCount: { type: Number, default: 0 },
  labels: [String],
  bannerImage: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

stateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
```

### City Model
```javascript
// models/cityModel.js
const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  content: String,
  image: String
});

const citySchema = new mongoose.Schema({
  name: { type: String, required: true },
  stateId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'State' },
  slug: { type: String, required: true, unique: true },
  overview: { type: String, required: true },
  headline: String,
  subheadline: String,
  heroImageUrl: String,
  location: {
    lat: { type: Number, required: true },
    long: { type: Number, required: true }
  },
  isActive: { type: Boolean, default: true },
  localFood: [String],
  languagesSpoken: [String],
  emergencyHelpline: String,
  bannerImage: String,
  about: aboutSchema,
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }]
});
```

### Place Model
```javascript
// models/placeModel.js
const mongoose = require('mongoose');

const entryFeeSchema = new mongoose.Schema({
  adult: Number,
  child: Number,
  foreignNational: Number
});

const locationSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  address: String,
  neighborhood: String,
  nearbyLocalEats: [{
    name: String,
    distanceKm: Number
  }]
});

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  cityId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'City' },
  category: { type: String, required: true },
  experienceTypes: [String],
  entryFee: entryFeeSchema,
  location: locationSchema,
  accessibility: {
    wheelchairFriendly: Boolean,
    familyFriendly: Boolean,
    seniorFriendly: Boolean
  },
  timings: String,
  bestTimeToVisit: String,
  seasonalEvents: [String],
  visitorSentiments: [String],
  tips: [String]
});
```

## API Endpoint Migration

### Base Routes
```javascript
// routes/baseRoutes.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Travhoo' });
});

router.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

router.get('/db-status', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    const collections = await mongoose.connection.db.listCollections().toArray();
    const stats = {};
    
    for (const collection of collections) {
      stats[collection.name] = await mongoose.connection.db.collection(collection.name).countDocuments();
    }
    
    res.json({
      status: 'connected',
      database: process.env.MONGODB_NAME,
      collections: stats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Authentication & Authorization

Replace FastAPI's built-in security with Express middleware:

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate.' });
  }
};
```

## API Documentation (Swagger)

The API is documented using [Swagger UI](https://swagger.io/tools/swagger-ui/) and [OpenAPI 3.0](https://swagger.io/specification/).

- After starting the server, visit: [http://localhost:8000/api-docs](http://localhost:8000/api-docs)
- This provides an interactive UI to explore and test all available endpoints.
- Documentation is auto-generated from JSDoc comments in the `routes` and `controllers` directories.

## Database Migration Steps

1. **Backup Existing Data**
   ```powershell
   mongodump --uri="your_mongodb_uri" --out="./backup"
   ```

2. **Data Transformation**
   - Convert ObjectIds to proper format
   - Transform field names from snake_case to camelCase
   - Update date fields to proper format

3. **Restore Data**
   ```powershell
   mongorestore --uri="new_mongodb_uri" --dir="./backup"
   ```

## Testing Strategy

1. Create parallel test environments
2. Implement API tests using Jest
3. Run both systems simultaneously
4. Compare responses
5. Gradually migrate traffic

## Migration Process

1. **Phase 1: Setup & Structure**
   - Set up Node.js project
   - Create basic Express app
   - Implement database connection
   - Create models

2. **Phase 2: Core Features**
   - Implement routes
   - Add controllers
   - Set up validation
   - Add error handling

3. **Phase 3: Testing & Validation**
   - Write unit tests
   - Add integration tests
   - Test data migration
   - Performance testing

4. **Phase 4: Deployment**
   - Set up CI/CD
   - Configure monitoring
   - Deploy staging
   - Gradually route traffic

## Environment Variables

```env
# .env
NODE_ENV=development
PORT=8000
MONGODB_URI=mongodb://localhost:27017/travel_guide
JWT_SECRET=your_jwt_secret
```

## Additional Considerations

1. **Error Handling**
   - Implement global error handler
   - Standardize error responses
   - Add logging

2. **Validation**
   - Use Joi for request validation
   - Implement middleware for common validations
   - Add sanitization

3. **Performance**
   - Implement caching
   - Add pagination
   - Optimize queries

4. **Documentation**
   - Set up Swagger/OpenAPI
   - Add JSDoc comments
   - Update README

## Next Steps

1. Set up Node.js development environment
2. Install required dependencies
3. Create project structure
4. Begin model migration
5. Implement routes and controllers
6. Add tests
7. Deploy and test