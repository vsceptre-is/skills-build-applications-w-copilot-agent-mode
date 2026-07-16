"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = Number(process.env.PORT || 8000);
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : `http://localhost:${port}`;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', port, apiUrl: baseUrl });
});
const resources = {
    users: [{ id: 1, username: 'ada', email: 'ada@example.com', role: 'admin' }],
    teams: [{ id: 1, name: 'Alpha', members: ['ada', 'grace'] }],
    activities: [{ id: 1, type: 'run', durationMinutes: 30 }],
    leaderboard: [{ id: 1, username: 'ada', score: 120 }],
    workouts: [{ id: 1, name: 'HIIT', durationMinutes: 20 }],
};
function registerResourceRoutes(resourceName, data) {
    const routePath = `/api/${resourceName}`;
    const routePathWithSlash = `${routePath}/`;
    app.get([routePath, routePathWithSlash], (_req, res) => {
        res.json({ resource: resourceName, count: data.length, results: data });
    });
    app.post([routePath, routePathWithSlash], (req, res) => {
        const item = { id: Date.now(), ...req.body };
        data.push(item);
        res.status(201).json(item);
    });
    app.get(`${routePath}/:id`, (req, res) => {
        const item = data.find((entry) => entry.id === Number(req.params.id));
        if (!item) {
            res.status(404).json({ error: `${resourceName} not found` });
            return;
        }
        res.json(item);
    });
}
Object.entries(resources).forEach(([resourceName, data]) => {
    registerResourceRoutes(resourceName, data);
});
app.get('/api', (_req, res) => {
    res.json({
        message: 'Octofit Tracker API',
        endpoints: Object.keys(resources).map((resourceName) => `/api/${resourceName}`),
    });
});
void (0, database_1.connectDatabase)().finally(() => {
    app.listen(port, () => {
        console.log(`Backend listening on port ${port}`);
        console.log(`API base URL: ${baseUrl}`);
    });
});
