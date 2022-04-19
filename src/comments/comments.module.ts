import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

import { ProductsModule } from './../products/products.module';
@Module({
  imports: [TypeOrmModule.forFeature([Comment]), ProductsModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
