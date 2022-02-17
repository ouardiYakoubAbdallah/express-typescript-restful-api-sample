import mongoose from 'mongoose';
import debug from 'debug';

const log: debug.IDebugger = debug('app:mongoose-service');

class MongooseService {
	private attemptsCount = 0;
	private mongooseOptions = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		serverSelectionTimeoutMS: 5000,
	};

	constructor() {
		this.connectWithRetry();
	}

	getMongoose() {
		return mongoose;
	}

	connectWithRetry = () => {
		log('Attempting MongoDB connection (will retry if needed)');
		mongoose
			.connect('mongodb://localhost:27017/api-db', this.mongooseOptions)
			.then(() => log('MongoDB Connected successfully'))
			.catch((err) => {
				const retrySeconds = 5;
				this.attemptsCount++;
				log(
					`Connection failed, will retry in ${retrySeconds} seconds...\nERROR:`,
					err
				);
				setTimeout(this.connectWithRetry, retrySeconds * 1000);
			});
	};
}

export default new MongooseService();
