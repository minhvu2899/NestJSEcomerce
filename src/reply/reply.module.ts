import { Module } from '@nestjs/common';
import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reply } from './reply.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reply])],
  controllers: [ReplyController],
  providers: [ReplyService],
})
export class ReplyModule {}
