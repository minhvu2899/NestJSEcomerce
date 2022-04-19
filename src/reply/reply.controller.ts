import { Body, Controller, Post } from '@nestjs/common';
import { ReplyService } from './reply.service';

@Controller('reply')
export class ReplyController {
  constructor(private replyService: ReplyService) {}
  @Post()
  createReply(@Body() reply) {
    return this.replyService.createReply(reply);
  }
  // @Get('/:id/product')
  // getCommentByProduct(@Param('id') id: string) {
  //   const product = { id };
  //   return this.commentsService.find({ product });
  // }
  //   @Get()
  //   getAllComment(@Query() filterCommentsDto) {
  //     return this.commentsService.getAllComments(filterCommentsDto);
  //   }
}
