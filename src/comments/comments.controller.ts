import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}
  @Post()
  createComment(@Body() comment) {
    return this.commentsService.createComment(comment);
  }
  // @Get('/:id/product')
  // getCommentByProduct(@Param('id') id: string) {
  //   const product = { id };
  //   return this.commentsService.find({ product });
  // }
  @Get()
  getAllComment(@Query() filterCommentsDto) {
    return this.commentsService.getAllComments(filterCommentsDto);
  }
}
