import mongoose, { Schema } from 'mongoose';

const countrySchema = new Schema({
  id: { type: String, required: true, unique: true },
  continent_id: { type: Schema.Types.ObjectId, required: true },
  flag_url: { type: String },
  name: { type: String, required: true },
  iso_code: { type: String },
  slug: { type: String, required: true, unique: true }
});

export default mongoose.model('Country', countrySchema); 