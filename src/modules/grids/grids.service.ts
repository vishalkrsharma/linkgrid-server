import { Injectable, Req } from '@nestjs/common';
import { CreateGridDto } from './dto/create-grid.dto';
import { UpdateGridDto } from './dto/update-grid.dto';
import { Model, Types } from 'mongoose';
import { Grid } from 'src/schemas/grid.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class GridsService {
  constructor(@InjectModel(Grid.name) private gridModel: Model<Grid>) {}
  async createDefaultGrid(userId: Types.ObjectId, identifier: string) {
    await this.gridModel.create({
      userId: new Types.ObjectId(userId),
      identifier,
    });
  }

  async getByUserId(userId: string) {
    const grids = await this.gridModel.find({
      userId: new Types.ObjectId(userId),
    });

    return grids;
  }

  create(createGridDto: CreateGridDto) {
    return 'This action adds a new grid';
  }

  findAll() {
    return `This action returns all grid`;
  }

  findOne(id: number) {
    return `This action returns a #${id} grid`;
  }

  update(id: number, updateGridDto: UpdateGridDto) {
    return `This action updates a #${id} grid`;
  }

  remove(id: number) {
    return `This action removes a #${id} grid`;
  }
}
