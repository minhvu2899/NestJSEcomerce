import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/user.entity';
import { AddressesService } from './addresses.service';
@UseGuards(AuthGuard('jwt'))
@Controller('addresses')
export class AddressesController {
  constructor(private addressService: AddressesService) {}
  @Get()
  getAll(@GetUser() user: User) {
    console.log(user);
    return this.addressService.getAll(user);
  }
  @Get('/:id')
  getAddressById(@Param('id') id: string) {
    return this.addressService.getAddressById(id);
  }
  @Post('')
  createAddress(@Body() createAddressDto, @GetUser() user: User) {
    return this.addressService.createAddress(createAddressDto, user);
  }
  @Patch('/:id')
  updateAddress(@Body() updateAddressDto, @Param('id') id: string) {
    return this.addressService.updateAddress(id, updateAddressDto);
  }
  @Delete('/:id')
  deteleAddress(@Param('id') id: string) {
    return this.addressService.deleteAddress(id);
  }
}
