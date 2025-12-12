import { UserRepository } from './user.repository';
import { IUser } from './user.entity';

export class UserService {
    static async createUser(data: Partial<IUser>): Promise<IUser> {
        // TBD: Add any business logic here
        return await UserRepository.create(data);
    }

    static async getAllUsers(): Promise<IUser[]> {
        return await UserRepository.findAll();
    }

    static async getUserById(id: string): Promise<IUser | null> {
        return await UserRepository.findById(id);
    }

    static async getUserByEmail(email: string): Promise<IUser | null> {
        return await UserRepository.findByEmail(email);
    }
}
