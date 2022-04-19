import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { WistList } from './wistlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WistList])],
  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule {}
