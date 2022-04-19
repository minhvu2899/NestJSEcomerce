import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Repository } from 'typeorm';
import { Color } from './color.entity';
import { Size } from './size.entity';
@Injectable()
export class ColorsService extends AbstractService {
  constructor(
    @InjectRepository(Color) private colorRepository: Repository<Color>,
  ) {
    super(colorRepository);
  }
}
