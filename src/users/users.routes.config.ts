import { CommonRoutesConfig } from '../common/common.routes.config';
import express from 'express';
import usersController from './controllers/users.controller';
import usersMiddleware from './middleware/users.middleware';

export class UsersRoutes extends CommonRoutesConfig {
	public constructor(app: express.Application) {
		super(app, 'UsersRoutes');
	}

	configureRoutes() {
		this.app
			.route('/users')
			.get(usersController.listUsers)
			.post(
				[
					usersMiddleware.validateRequiredFields,
					usersMiddleware.validateEmailExistence,
				],
				usersController.createUser
			);

		this.app.param('userId', usersMiddleware.extractUserId);
		this.app
			.route('/users/:userId')
			.all(usersMiddleware.validateUserExists)
			.get(usersController.getUserById)
			.delete(usersController.removeUser);

		this.app.put(
			'/users/:userId',
			[
				usersMiddleware.validateRequiredFields,
				usersMiddleware.validateEmailForUser,
			],
			usersController.put
		);

		this.app.patch(
			'/users/:userId',
			[usersMiddleware.validatePatchEmail],
			usersController.patch
		);

		return this.app;
	}
}
