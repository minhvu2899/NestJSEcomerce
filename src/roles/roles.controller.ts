import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { AuthGuard } from '@nestjs/passport';
import { HasPermission } from '../permission/has-permission.decorator';
import { RolesGuard } from 'src/permission/permission.guard';
import { Roles } from './roles.decorator';

@Controller('roles')
@UseGuards(RolesGuard)
@UseGuards(AuthGuard('jwt'))
export class RolesController {
  constructor(private roleService: RolesService) {}

  @Get()
  @Roles('products')
  async all(@Query('page') page) {
    return this.roleService.all();
  }

  @Post()
  @HasPermission('roles')
  async create(@Body('name') name: string, @Body('permissions') ids: number[]) {
    return this.roleService.create({
      name,
      permissions: ids.map((id) => ({ id })),
    });
  }

  @Get(':id')
  @HasPermission('roles')
  async get(@Param('id') id: number) {
    return this.roleService.findOne({ id }, ['permissions']);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('permissions') ids: number[],
  ) {
    await this.roleService.update(id, { name });

    const role = await this.roleService.findOne({ id });

    return this.roleService.create({
      ...role,
      permissions: ids.map((id) => ({ id })),
    });
  }

  @Delete(':id')
  @HasPermission('roles')
  async delete(@Param('id') id: string) {
    return this.roleService.delete(id);
  }
}
