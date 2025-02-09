import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { GridsService } from './grids.service';
import { CreateGridDto } from './dto/create-grid.dto';
import { UpdateGridDto } from './dto/update-grid.dto';
import { AccessTokenGuard } from 'src/common/gaurds/access-token.guard';

@Controller('grids')
@UseGuards(AccessTokenGuard)
export class GridsController {
  constructor(private readonly gridsService: GridsService) {}

  @Get()
  getByUserId(@Req() req: Request) {
    const user = req['user'];
    return this.gridsService.getByUserId(user._id);
  }

  @Post()
  create(@Body() createGridDto: CreateGridDto) {
    return this.gridsService.create(createGridDto);
  }

  @Get()
  findAll() {
    return this.gridsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gridsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGridDto: UpdateGridDto) {
    return this.gridsService.update(+id, updateGridDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gridsService.remove(+id);
  }
}
