"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("../models");
/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
    const connectionString = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/octofit_db';
    try {
        await mongoose_1.default.connect(connectionString, { serverSelectionTimeoutMS: 2000 });
        console.log('Connected to octofit_db');
        await Promise.all([
            models_1.User.deleteMany({}),
            models_1.Team.deleteMany({}),
            models_1.Activity.deleteMany({}),
            models_1.LeaderboardEntry.deleteMany({}),
            models_1.Workout.deleteMany({}),
        ]);
        const users = await models_1.User.insertMany([
            { username: 'ada', email: 'ada@example.com', role: 'admin' },
            { username: 'grace', email: 'grace@example.com', role: 'member' },
            { username: 'linus', email: 'linus@example.com', role: 'coach' },
        ]);
        await models_1.Team.insertMany([
            { name: 'Alpha', members: users.slice(0, 2).map((user) => user.username) },
            { name: 'Beta', members: [users[2].username] },
        ]);
        await models_1.Activity.insertMany([
            { type: 'run', durationMinutes: 30, userId: users[0]._id.toString(), date: new Date('2026-07-15') },
            { type: 'cycling', durationMinutes: 45, userId: users[1]._id.toString(), date: new Date('2026-07-16') },
        ]);
        await models_1.LeaderboardEntry.insertMany([
            { username: users[0].username, score: 120 },
            { username: users[1].username, score: 95 },
            { username: users[2].username, score: 88 },
        ]);
        await models_1.Workout.insertMany([
            { name: 'HIIT', durationMinutes: 20, difficulty: 'intermediate' },
            { name: 'Yoga Flow', durationMinutes: 25, difficulty: 'beginner' },
        ]);
        console.log('Database seeding complete');
        await mongoose_1.default.disconnect();
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}
void seedDatabase();
