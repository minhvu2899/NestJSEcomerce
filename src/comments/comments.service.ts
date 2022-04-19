import { Injectable } from '@nestjs/common';
import { AbstractService } from 'src/common/abstract.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
    private productsService: ProductsService,
  ) {}
  async createComment(createComment): Promise<any> {
    console.log(createComment);
    // const { category, subcategory } = createProduct;
    const comment = await this.commentsRepository.create({
      ...createComment,
    });
    console.log(comment);
    await this.commentsRepository.save(comment);
    await this.productsService.updateReview(createComment.product.id);
    return;
  }
  async getAllComments(filterCommentsDto) {
    const { star } = filterCommentsDto;
    if (star && star !== '0') {
      return this.commentsRepository.find({
        where: { rate: star },
        relations: ['product', 'user', 'reply'],
      });
    } else {
      return this.commentsRepository.find({
        relations: ['product', 'user', 'reply'],
      });
    }
  }
}
