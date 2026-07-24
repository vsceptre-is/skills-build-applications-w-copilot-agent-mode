"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const models_1 = require("./models");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = Number(process.env.PORT || 8000);
const host = process.env.HOST || '0.0.0.0';
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : `http://localhost:${port}`;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', port, apiUrl: baseUrl });
});
app.get(['/api/users', '/api/users/'], async (_req, res) => {
    const users = await models_1.User.find({}).lean();
    res.json({ resource: 'users', count: users.length, results: users });
});
app.get(['/api/teams', '/api/teams/'], async (_req, res) => {
    const teams = await models_1.Team.find({}).lean();
    res.json({ resource: 'teams', count: teams.length, results: teams });
});
app.get(['/api/activities', '/api/activities/'], async (_req, res) => {
    const activities = await models_1.Activity.find({}).lean();
    res.json({ resource: 'activities', count: activities.length, results: activities });
});
app.get(['/api/leaderboard', '/api/leaderboard/'], async (_req, res) => {
    const leaderboard = await models_1.LeaderboardEntry.find({}).lean();
    res.json({ resource: 'leaderboard', count: leaderboard.length, results: leaderboard });
});
app.get(['/api/workouts', '/api/workouts/'], async (_req, res) => {
    const workouts = await models_1.Workout.find({}).lean();
    res.json({ resource: 'workouts', count: workouts.length, results: workouts });
});
app.get('/api', (_req, res) => {
    res.json({
        message: 'Octofit Tracker API',
        endpoints: ['/api/users', '/api/teams', '/api/activities', '/api/leaderboard', '/api/workouts'],
    });
});
void (0, database_1.connectDatabase)().finally(() => {
    app.listen(port, host, () => {
        console.log(`Backend listening on ${host}:${port}`);
        console.log(`API base URL: ${baseUrl}`);
    });
});
