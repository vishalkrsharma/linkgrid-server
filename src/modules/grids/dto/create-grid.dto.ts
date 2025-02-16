import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import { LinkDto } from 'src/common/dto/link.dto';

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

  @ValidateNested({ each: true })
  @Type(() => LinkDto)
  links: LinkDto[] = [];
}
