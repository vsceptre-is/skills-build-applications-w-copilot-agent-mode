import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { Activity, LeaderboardEntry, Team, User, Workout } from './models';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 8000);
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${port}`;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', port, apiUrl: baseUrl });
});

app.get('/api/users/', async (_req: Request, res: Response) => {
  const users = await User.find({}).lean();
  res.json({ resource: 'users', count: users.length, results: users });
});

app.get('/api/teams/', async (_req: Request, res: Response) => {
  const teams = await Team.find({}).lean();
  res.json({ resource: 'teams', count: teams.length, results: teams });
});

app.get('/api/activities/', async (_req: Request, res: Response) => {
  const activities = await Activity.find({}).lean();
  res.json({ resource: 'activities', count: activities.length, results: activities });
});

app.get('/api/leaderboard/', async (_req: Request, res: Response) => {
  const leaderboard = await LeaderboardEntry.find({}).lean();
  res.json({ resource: 'leaderboard', count: leaderboard.length, results: leaderboard });
});

app.get('/api/workouts/', async (_req: Request, res: Response) => {
  const workouts = await Workout.find({}).lean();
  res.json({ resource: 'workouts', count: workouts.length, results: workouts });
});

app.get('/api', (_req: Request, res: Response) => {
  res.json({
    message: 'Octofit Tracker API',
    endpoints: ['/api/users', '/api/teams', '/api/activities', '/api/leaderboard', '/api/workouts'],
  });
});

void connectDatabase().finally(() => {
  app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
    console.log(`API base URL: ${baseUrl}`);
  });
});
