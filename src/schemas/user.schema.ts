import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as argon2 from 'argon2';
import { hashData } from 'src/common/lib/utils';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({
    unique: true,
    required: true,
    type: String,
  })
  username: string;

  @Prop({
    default: null,
    type: String,
  })
  name?: string;

  @Prop({
    default: null,
    type: String,
  })
  imageUrl?: string;

  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  email: string;

  @Prop({
    required: true,
    type: String,
  })
  password: string;

  @Prop({
    type: String,
  })
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    this.password = await hashData(this.password);
    next();
  } catch (error) {
    next(error);
  }
});
