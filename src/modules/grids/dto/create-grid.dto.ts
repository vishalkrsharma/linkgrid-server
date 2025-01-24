import { IsNotEmpty, isNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateGridDto {
  @IsString({
    message: 'User Id must be a string',
  })
  @IsNotEmpty({
    message: 'User Id is required',
  })
  userId: Types.ObjectId;

  @IsString({
    message: 'Grid Identifier must be a string',
  })
  @IsNotEmpty({
    message: 'Grid Identifier is required',
  })
  identifier: string;

  @IsString({
    each: true,
    message: 'Each link must be a string',
  })
  links: string[] = [];
}
