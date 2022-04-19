import { Module } from '@nestjs/common';
import { GhtkService } from './ghtk.service';
import { GhtkController } from './ghtk.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [GhtkService],
  controllers: [GhtkController],
  exports: [GhtkService],
})
export class GhtkModule {}
