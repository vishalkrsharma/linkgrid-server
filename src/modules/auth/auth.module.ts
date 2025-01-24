import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/modules/users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { GridsService } from 'src/modules/grids/grids.service';
import { Grid, GridSchema } from 'src/schemas/grid.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Grid.name, schema: GridSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, GridsService],
})
export class AuthModule {}
