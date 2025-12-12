import User, { IUser } from './user.entity';

export class UserRepository {
    static async create(user: Partial<IUser>): Promise<IUser> {
        const newUser = new User(user);
        return await newUser.save();
    }

    static async findAll(): Promise<IUser[]> {
        return await User.find({});
    }

    static async findById(id: string): Promise<IUser | null> {
        return await User.findById(id);
    }

    static async findByEmail(email: string): Promise<IUser | null> {
        return await User.findOne({ email });
    }
}
