# API Routes: States

| Route                        | Method | Purpose                                                      |
|-----------------------------|--------|--------------------------------------------------------------|
| /states/home                | GET    | Get lightweight state info for home page                     |
| /states                     | GET    | Get all states (with country info)                           |
| /states/labels?labels=...   | GET    | Get states filtered by one or more labels                    |
| /states/:id                 | GET    | Get a state by its MongoDB ObjectId                          |
| /states                     | POST   | Create a new state                                           |
| /states/:id                 | PUT    | Update a state by its ObjectId                               |
| /states/:id                 | DELETE | Delete a state by its ObjectId                               |
| /states/region/:region      | GET    | Get all states in a specific region                          |
| /states/popular             | GET    | Get the most popular states                                  |
| /states/slug/:slug          | GET    | Get a state by its slug (SEO-friendly URL)                   |

**Query Parameters:**
- `/states/labels?labels=Heritage,Business` — Comma-separated list of labels to filter states.

**Notes:**
- All GET endpoints return state info with a `location` field containing `countryId` and `countryName`.
- The order of routes matters: `/labels` must be above `/:id` in the router. 