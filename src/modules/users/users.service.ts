import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(user: User) {
    const createdUser = await this.userModel.create(user);
    return createdUser.save();
  }
  async findOne(identifier: string) {
    const user = await this.userModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });
    return user;
  }
}
