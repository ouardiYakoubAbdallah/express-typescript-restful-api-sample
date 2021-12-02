import express from 'express';
import * as http from 'http';

import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import { CommonRoutesConfig } from './common/common.routes.config';
import { UsersRoutes } from './users/users.routes.config';
import debug from 'debug';

const app: express.Application = express();
const server: http.Server = http.createServer(app);

const PORT = 3000;

const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug('app');

// Add middleware to parse all incoming requests as JSON
app.use(express.json());

// Add middleware to allow cross-origin requests
app.use(cors());

// Preparing the expressWinston logging middleware configuration,
// which will automatically log all HTTP requests handled by Express.js
const loggerOptions: expressWinston.LoggerOptions = {
	transports: [new winston.transports.Console()],
	format: winston.format.combine(
		winston.format.json(),
		winston.format.prettyPrint(),
		winston.format.colorize({ all: true })
	),
};

if (!process.env.DEBUG) {
	loggerOptions.meta = false; // when not debugging, log requests as one-liners
}

// Initialize the logger with the above configuration
app.use(expressWinston.logger(loggerOptions));

// Adding the UserRoutes
routes.push(new UsersRoutes(app));

// this is a simple route to make sure everything is working properly
app.get('/', (req: express.Request, res: express.Response) => {
	res.status(200).send({
		message: 'Hello @types/world !',
	});
});

// Start the server
server.listen(PORT, () => {
	routes.forEach((route: CommonRoutesConfig) => {
		debugLog(`Routes configured for ${route.getName()}`);
	});
	// our only exception to avoiding console.log(), because we
	// always want to know when the server is done starting up
	console.log(`🚀 Server running at http://localhost:${PORT}`);
});
