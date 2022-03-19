import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private repository: Repository<Permission>,
  ) {}

  create(createPermissionDto: CreatePermissionDto) {
    return this.repository.save(createPermissionDto);
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return this.repository.update(id, updatePermissionDto);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
