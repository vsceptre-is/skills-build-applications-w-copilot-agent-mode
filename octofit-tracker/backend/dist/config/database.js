"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const connectionString = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/octofit_db';
const db = mongoose_1.default.connection;
db.on('error', (error) => console.error('connection error:', error));
async function connectDatabase() {
    try {
        await mongoose_1.default.connect(connectionString, {
            serverSelectionTimeoutMS: 2000,
        });
        console.log(`Connected to ${mongoose_1.default.connection.name}`);
        return mongoose_1.default.connection;
    }
    catch (error) {
        console.warn('MongoDB connection unavailable. Continuing without a database connection.', error);
        return mongoose_1.default.connection;
    }
}
exports.default = db;
