import { Types } from "mongoose";
import userRepo from "../repository/user.repo";

class UserService {
    async fetchUser(data: any) {
        if (data.role != 'admin') {
            const err: any = new Error(
                'Only admins can view users'
            );
            err.status = 403;
            throw err;
        }

        const user = await userRepo.fetchUser(
            {
                _id: { $eq: new Types.ObjectId(data.member) },
            }
        );

        if (!user) {
            const err: any = new Error('User not found');
            err.status = 404;
            throw err;
        }

        return {
            message: 'success',
            data: {
                user,
            },
        };
    }

    async updateUser(data: any) {
        if (data.role != 'admin') {
            const err: any = new Error(
                'Only admins can manage users'
            );
            err.status = 403;
            throw err;
        }

        const { role, member, ...update } = data;
        const user: any = await userRepo.updateOne(
            {
                _id: { $eq: member },
            },
            update
        );

        if (!user) {
            const err: any = new Error('Book not found');
            err.status = 404;
            throw err;
        }

        return {
            message: 'success',
        };
    }

    async fetchUsers(data: any) {
        if (data.role != 'admin') {
            const err: any = new Error(
                'Only admins can view users'
            );
            err.status = 403;
            throw err;
        }

        const search: any = data.search
            ? {
                $expr: {
                    $regexMatch: {
                        input: '$name',
                        regex: data.search,
                        options: 'i',
                    },
                },
            }
            : {};

        const result = await userRepo.fetchUsers(
            {},
            Math.abs(Number(data.limit) || 10),
            Math.abs(Number(data.page) || 1),
            search
        );

        return {
            message: 'Success',
            data: {
                ...result,
            },
        };
    }

    async deleteUser(data: any) {
        if (data.role != 'admin') {
            const err: any = new Error(
                'Only admins can manage users'
            );
            err.status = 403;
            throw err;
        }

        const userData = await userRepo.findOneAndDelete({
            _id: { $eq: new Types.ObjectId(data.user) },
        });

        if (!userData) {
            const err: any = new Error('Book not found');
            err.status = 404;
            throw err;
        }

        return {
            message: 'success',
        };
    }
    
}

export default new UserService();
