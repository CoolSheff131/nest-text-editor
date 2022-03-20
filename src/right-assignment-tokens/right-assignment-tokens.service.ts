import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionEntity } from 'src/permissions/entities/permission.entity';
import { Repository } from 'typeorm';
import { CreateRightAssignmentTokenDto } from './dto/create-right-assignment-token.dto';
import { UpdateRightAssignmentTokenDto } from './dto/update-right-assignment-token.dto';
import { RightAssignmentTokenEntity } from './entities/right-assignment-token.entity';

@Injectable()
export class RightAssignmentTokensService {
  constructor(
    @InjectRepository(RightAssignmentTokenEntity)
    private rightTokensRepository: Repository<RightAssignmentTokenEntity>,
    @InjectRepository(PermissionEntity)
    private permissionRepository: Repository<PermissionEntity>,
  ) {}

  create(createRightAssignmentTokenDto: CreateRightAssignmentTokenDto) {
    return this.rightTokensRepository.save({
      permission: createRightAssignmentTokenDto.permission,
      text: { id: createRightAssignmentTokenDto.textId },
    });
  }

  async activate(userId: number, tokenId: number) {
    const find = await this.rightTokensRepository.findOne(tokenId, {
      relations: ['text'],
    });
    if (!find) {
      throw new NotFoundException('Токен не найден');
    }

    this.permissionRepository.save({
      user: { id: userId },
      text: find.text,
      permission: find.permission,
    });
    return this.rightTokensRepository.delete(tokenId);
  }

  async findAll() {
    return await this.rightTokensRepository.find();
  }

  async findOne(id: number) {
    return await this.rightTokensRepository.findOne(id);
  }

  async update(
    id: number,
    updateRightAssignmentTokenDto: UpdateRightAssignmentTokenDto,
  ) {
    const find = await this.rightTokensRepository.findOne(id);
    if (!find) {
      throw new NotFoundException('Токен не найден');
    }

    return this.rightTokensRepository.update(id, updateRightAssignmentTokenDto);
  }

  async remove(id: number) {
    const find = await this.rightTokensRepository.findOne(id);
    if (!find) {
      throw new NotFoundException('Токен не найден');
    }
    return this.rightTokensRepository.delete(id);
  }
}
