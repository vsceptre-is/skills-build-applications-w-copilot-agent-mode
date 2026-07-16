import mongoose from 'mongoose';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  const connectionString = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/octofit_db';

  try {
    await mongoose.connect(connectionString, { serverSelectionTimeoutMS: 2000 });
    console.log('Connected to octofit_db');

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      LeaderboardEntry.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const users = await User.insertMany([
      { username: 'ada', email: 'ada@example.com', role: 'admin' },
      { username: 'grace', email: 'grace@example.com', role: 'member' },
      { username: 'linus', email: 'linus@example.com', role: 'coach' },
    ]);

    await Team.insertMany([
      { name: 'Alpha', members: users.slice(0, 2).map((user) => user.username) },
      { name: 'Beta', members: [users[2].username] },
    ]);

    await Activity.insertMany([
      { type: 'run', durationMinutes: 30, userId: users[0]._id.toString(), date: new Date('2026-07-15') },
      { type: 'cycling', durationMinutes: 45, userId: users[1]._id.toString(), date: new Date('2026-07-16') },
    ]);

    await LeaderboardEntry.insertMany([
      { username: users[0].username, score: 120 },
      { username: users[1].username, score: 95 },
      { username: users[2].username, score: 88 },
    ]);

    await Workout.insertMany([
      { name: 'HIIT', durationMinutes: 20, difficulty: 'intermediate' },
      { name: 'Yoga Flow', durationMinutes: 25, difficulty: 'beginner' },
    ]);

    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

void seedDatabase();
