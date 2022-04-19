import { Injectable } from '@nestjs/common';
import { Reply } from './reply.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ReplyService {
  constructor(
    @InjectRepository(Reply) private replyRepository: Repository<Reply>,
  ) {}
  async createReply(createReply): Promise<any> {
    console.log(createReply);
    // const { category, subcategory } = createProduct;
    const reply = await this.replyRepository.create({
      ...createReply,
    });
    console.log(reply);
    await this.replyRepository.save(reply);
    return;
  }
}
