import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserCreateDto } from './models/user-create.dto';
import { UserUpdateDto } from './models/user-update.dto';
import { AuthService } from '../auth/auth.service';
import { Request } from 'express';
import { HasPermission } from '../permission/has-permission.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { GetUser } from './../auth/get-user.decorator';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @UseGuards(AuthGuard('jwt'))
  @Get()
  @HasPermission('users')
  async all(@Query('page') page = 1) {
    return this.usersService.paginate(page, ['role']);
  }
  @Get('getResetToken')
  async getResetToken(@Query('email') email: string) {
    return this.usersService.getResetPassWordToken(email);
  }
  @Patch('resetPassWord')
  async resetPassword(
    @Body('newPassword') newPassword: string,
    @Body('email') email: string,
  ) {
    return this.usersService.resetPassword(newPassword, email);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @HasPermission('users')
  async get(@Param('id') id: string) {
    return this.usersService.getUserById(id, ['role']);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('info')
  async updateInfo(@GetUser() user, @Body() body: UserUpdateDto) {
    const id = user.id;

    await this.usersService.update(id, body);

    return this.usersService.findOne({ id });
  }
  @UseGuards(AuthGuard('jwt'))
  @Patch('update')
  async updateUser(@Body() body: UserUpdateDto) {
    const { id, ...data } = body;
    console.log(body);
    await this.usersService.update(id, {
      ...data,
    });

    // await this.usersService.update(id, body);

    return this.usersService.findOne({ id });
  }

  //   @Put('password')
  //   async updatePassword(
  //     @Req() request: Request,
  //     @Body('password') password: string,
  //     @Body('password_confirm') password_confirm: string,
  //   ) {
  //     if (password !== password_confirm) {
  //       throw new BadRequestException('Passwords do not match!');
  //     }

  //     const id = await this.authService.userId(request);

  //     const hashed = await bcrypt.hash(password, 12);

  //     await this.usersService.update(id, {
  //       password: hashed,
  //     });

  //     return this.usersService.findOne({ id });
  //   }
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @HasPermission('users')
  async update(@Param('id') id: string, @Body() body: UserUpdateDto) {
    const { role, ...data } = body;

    await this.usersService.update(id, {
      ...data,
      role: { id: role },
    });

    return this.usersService.findOne({ id });
  }

  @Delete(':id')
  @HasPermission('users')
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
