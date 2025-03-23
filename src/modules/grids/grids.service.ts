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
    const grids = await this.gridModel
      .find({
        userId: new Types.ObjectId(userId),
      })
      .select('_id userId identifier');

    return grids;
  }

  async getGridByIdentifier(identifier: string) {
    const grid = await this.gridModel
      .findOne({ identifier })
      .select('identifier links');

    return grid;
  }

  async getById(id: string) {
    const grid = await this.gridModel.findById(id);

    return grid;
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

  async update(id: string, updateGridDto: UpdateGridDto) {
    await this.gridModel
      .findByIdAndUpdate(id, updateGridDto, { new: true })
      .exec();

    return { message: 'Grid updated successfully' };
  }

  remove(id: number) {
    return `This action removes a #${id} grid`;
  }
}
