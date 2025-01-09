import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({
    unique: true,
    required: true,
  })
  username: string;

  @Prop({
    default: null,
  })
  name?: string;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async (next) => {
  const user = this as UserDocument;

  if (!user.isModified('password')) return next();

  try {
    user.password = await bcrypt.hash(
      user.password,
      process.env.BCRYPT_SALT_ROUNDS,
    );
    return next();
  } catch (error) {
    return next(error);
  }
});
