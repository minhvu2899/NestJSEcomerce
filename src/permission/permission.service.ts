import { Injectable } from '@nestjs/common';
import { Permission } from './permission.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';

@Injectable()
export class PermissionService extends AbstractService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {
    super(permissionRepository);
  }
}
