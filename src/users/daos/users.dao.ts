import mongooseService from '../../common/services/mongoose.service';
import { CreateUserDto } from '../dto/create.user.dto';
import { PatchUserDto } from '../dto/patch.user.dto';
import { PutUserDto } from '../dto/put.user.dto';

import shortid from 'shortid';
import debug from 'debug';

const log: debug.IDebugger = debug('app:in-memory-dao');

class UserDao {
	Schema = mongooseService.getMongoose().Schema;

	userSchema = new this.Schema(
		{
			_id: String,
			email: String,
			password: { type: String, select: false },
			firstName: String,
			lastName: String,
			permissionFlags: Number,
		},
		{
			id: false,
		}
	);

	User = mongooseService.getMongoose().model('Users', this.userSchema);

	constructor() {
		log('New instance of UsersDao created.');
	}

	async addUser(userFields: CreateUserDto) {
		const userId = shortid.generate();
		const user = new this.User({
			_id: userId,
			...userFields,
			permissionFlags: 1,
		});
		await user.save();
		return userId;
	}

	async getUserByEmail(email: String) {
		return this.User.findOne({ email: email }).exec();
	}

	async getUserById(userId: String) {
		return this.User.findOne({ _id: userId }).populate('User').exec();
	}

	async getUsers(limit = 25, page = 0) {
		return this.User.find()
			.limit(limit)
			.skip(limit * page)
			.exec();
	}

	async updateUserById(userId: String, userFields: PatchUserDto | PutUserDto) {
		return await this.User.findByIdAndUpdate(
			userId,
			{
				$set: userFields,
			},
			{
				new: true,
			}
		).exec();
	}

	async removeUserById(userId: string) {
		return this.User.findByIdAndDelete(userId).exec();
	}
}

export default new UserDao();
