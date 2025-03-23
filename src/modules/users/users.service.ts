import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { UpdateUserDto } from 'src/modules/users/dto/update-user.dto';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(user: CreateUserDto) {
    const createdUser = await this.userModel.create(user);
    return createdUser.save();
  }

  async findOne(identifier: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });
    return user;
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id);
  }

  async update(
    _id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return await this.userModel
      .findByIdAndUpdate(_id, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<UserDocument> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
