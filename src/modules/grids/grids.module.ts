import { Module } from '@nestjs/common';
import { GridsService } from './grids.service';
import { GridsController } from './grids.controller';
import { Grid, GridSchema } from 'src/schemas/grid.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Grid.name, schema: GridSchema }]),
  ],
  controllers: [GridsController],
  providers: [GridsService],
})
export class GridsModule {}
