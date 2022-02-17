import { Request, Response, NextFunction } from 'express';
import userService from '../services/users.service';
import debug from 'debug';

const log: debug.IDebugger = debug('app:users-controller');

class UsersMiddleware {
	async validateRequiredFields(req: Request, res: Response, next: NextFunction) {
		if (req.body && req.body.email && req.body.password) {
			next();
		} else {
			res.status(400).send({
				error: `Missing required fields email and password`,
			});
		}
	}

	async validateEmailExistence(req: Request, res: Response, next: NextFunction) {
		const user = await userService.getByEmail(req.body.email);
		if (user) {
			res.status(400).send({ error: `User email already exists` });
		} else {
			next();
		}
	}

	async validateEmailForUser(req: Request, res: Response, next: NextFunction) {
		const user = await userService.getByEmail(req.body.email);
		if (user && user._id === req.params.userId) {
			next();
		} else {
			res.status(400).send({ error: `Invalid email` });
		}
	}

	// Here we need to use an arrow function to bind `this` correctly
	validatePatchEmail = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		if (req.body.email) {
			log('Validating email', req.body.email);

			this.validateEmailForUser(req, res, next);
		} else {
			next();
		}
	};

	async validateUserExists(req: Request, res: Response, next: NextFunction) {
		const user = await userService.getById(req.params.userId);
		if (user) {
			next();
		} else {
			res.status(404).send({
				error: `User ${req.params.userId} not found`,
			});
		}
	}

	async extractUserId(req: Request, res: Response, next: NextFunction) {
		req.body.id = req.params.userId;
		next();
	}
}

export default new UsersMiddleware();
