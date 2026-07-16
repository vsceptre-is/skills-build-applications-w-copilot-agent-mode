import mongoose, { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  role: string;
}

export interface ITeam extends Document {
  name: string;
  members: string[];
}

export interface IActivity extends Document {
  type: string;
  durationMinutes: number;
  userId?: string;
  date: Date;
}

export interface ILeaderboardEntry extends Document {
  username: string;
  score: number;
}

export interface IWorkout extends Document {
  name: string;
  durationMinutes: number;
  difficulty: string;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'member' },
});

const teamSchema = new Schema<ITeam>({
  name: { type: String, required: true, unique: true },
  members: { type: [String], default: [] },
});

const activitySchema = new Schema<IActivity>({
  type: { type: String, required: true },
  durationMinutes: { type: Number, required: true },
  userId: { type: String },
  date: { type: Date, default: Date.now },
});

const leaderboardSchema = new Schema<ILeaderboardEntry>({
  username: { type: String, required: true, unique: true },
  score: { type: Number, required: true },
});

const workoutSchema = new Schema<IWorkout>({
  name: { type: String, required: true, unique: true },
  durationMinutes: { type: Number, required: true },
  difficulty: { type: String, default: 'beginner' },
});

export const User = mongoose.model<IUser>('User', userSchema);
export const Team = mongoose.model<ITeam>('Team', teamSchema);
export const Activity = mongoose.model<IActivity>('Activity', activitySchema);
export const LeaderboardEntry = mongoose.model<ILeaderboardEntry>('LeaderboardEntry', leaderboardSchema);
export const Workout = mongoose.model<IWorkout>('Workout', workoutSchema);
