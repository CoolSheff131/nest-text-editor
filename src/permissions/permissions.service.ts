import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionEntity } from 'src/permissions/entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(PermissionEntity)
    private repository: Repository<PermissionEntity>,
  ) {}

  create(createPermissionDto: CreatePermissionDto) {
    return this.repository.save(createPermissionDto);
  }

  findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    return await this.repository.findOne(id);
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return this.repository.update(id, {
      permission: updatePermissionDto.permission,
      text: { id: updatePermissionDto.textId },
      user: { id: updatePermissionDto.userId },
    });
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
