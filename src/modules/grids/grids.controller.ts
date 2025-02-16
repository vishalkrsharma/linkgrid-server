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
export class GridsController {
  constructor(private readonly gridsService: GridsService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  getByUserId(@Req() req: Request) {
    const user = req['user'];
    return this.gridsService.getByUserId(user._id);
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  getById(@Param('id') id: string) {
    return this.gridsService.getById(id);
  }

  @Get('public/:identifier')
  getGridByIdentifier(@Param('identifier') identifier: string) {
    return this.gridsService.getGridByIdentifier(identifier);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  create(@Body() createGridDto: CreateGridDto) {
    return this.gridsService.create(createGridDto);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  findAll() {
    return this.gridsService.findAll();
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  findOne(@Param('id') id: string) {
    return this.gridsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  update(@Param('id') id: string, @Body() updateGridDto: UpdateGridDto) {
    return this.gridsService.update(id, updateGridDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  remove(@Param('id') id: string) {
    return this.gridsService.remove(+id);
  }
}
