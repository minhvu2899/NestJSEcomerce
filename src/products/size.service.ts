import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Repository } from 'typeorm';
import { Size } from './size.entity';
@Injectable()
export class SizesService extends AbstractService {
  constructor(
    @InjectRepository(Size) private sizeRepository: Repository<Size>,
  ) {
    super(sizeRepository);
  }
}
