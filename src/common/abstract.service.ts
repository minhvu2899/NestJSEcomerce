import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PaginatedResult } from './paginated-result.interface';

@Injectable()
export abstract class AbstractService {
  protected constructor(protected readonly repository: Repository<any>) {}

  async all(relations = []): Promise<any[]> {
    return this.repository.find({ relations });
  }

  async paginate(options, relations = []): Promise<PaginatedResult> {
    const page = options._page ? options._page : 1;

    const take = options._limit ? options._limit : 10;
    const [data, total] = await this.repository.findAndCount({
      take,
      skip: (page - 1) * take,
      relations,
    });

    return {
      data: data,
      pagination: {
        total,
        current_page: +page,
        limit: +take,
      },
    };
  }

  async create(data): Promise<any> {
    return this.repository.save(data);
  }

  async findOne(condition, relations = []): Promise<any> {
    return this.repository.findOne(condition, { relations });
  }
  async find(condition): Promise<any[]> {
    return this.repository.find(condition);
  }

  async update(id: string, data): Promise<any> {
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<any> {
    return this.repository.delete(id);
  }
}
