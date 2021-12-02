import express from 'express';

export abstract class CommonRoutesConfig {
	app: express.Application;
	name: string;

	public constructor(app: express.Application, name: string) {
		this.app = app;
		this.name = name;

		this.configureRoutes();
	}

	public getName() {
		return this.name;
	}

	// Define an abstract method (function) to force any class extending << CommonRoutesConfig >>
	// to provide an implementation matching that signature.
	// This function is called at the end of the constructor since we are sure that this function will exist.
	abstract configureRoutes(): express.Application;
}
