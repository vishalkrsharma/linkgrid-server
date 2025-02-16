import { IsNotEmpty, IsString } from 'class-validator';

export class LinkDto {
  @IsString({
    message: 'Title must be a string',
  })
  @IsNotEmpty({
    message: 'Title is required',
  })
  title: string;

  @IsString({
    message: 'Link must be a string',
  })
  @IsNotEmpty({
    message: 'Link is required',
  })
  url: string;
}
