import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { AbstractService } from '../common/abstract.service';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService extends AbstractService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {
    super(roleRepository);
  }
}
