import mongoose from 'mongoose';
import { connectDB } from '../config/database';
import City from '../models/cityModel';
import State from '../models/stateModel';
import Place from '../models/placeModel';
import Service from '../models/serviceModel';

const clearDatabase = async (): Promise<void> => {
    try {
        await mongoose.connection.dropDatabase();
        console.log('Database cleared');
    } catch (error) {
        console.error('Error clearing database:', error);
        process.exit(1);
    }
};

const seedDatabase = async (): Promise<void> => {
    try {
        await connectDB();

        // Clear existing data
        await clearDatabase();

        // Add your seed data here
        // Example:
        // const states = await State.create([...]);
        // const cities = await City.create([...]);
        // const places = await Place.create([...]);
        // const services = await Service.create([...]);

        console.log('Data seeded successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

// Run the seeder
if (require.main === module) {
    seedDatabase();
}
