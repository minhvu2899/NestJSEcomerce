import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Param,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/get-user.decorator';
import { WishlistService } from './wishlist.service';
import { User } from 'src/users/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('wishlist')
@UseGuards(AuthGuard('jwt'))
export class WishlistController {
  constructor(private wistListService: WishlistService) {}
  @Post()
  add(@GetUser() user: User, @Body('productID') productID: string) {
    console.log(user);
    return this.wistListService.addToWistList(user, productID);
  }
  @Get()
  getAll(@GetUser() user: User) {
    return this.wistListService.getAll(user, ['product']);
  }
  @Delete('/:id')
  remove(@GetUser() user: User, @Param('id') id) {
    return this.wistListService.removeFromWistList(user, id);
  }
}
