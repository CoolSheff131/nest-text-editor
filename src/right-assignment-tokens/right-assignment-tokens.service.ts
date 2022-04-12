import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionEntity } from 'src/permissions/entities/permission.entity';
import { TextEntity } from 'src/text/entities/text.entity';
import { Repository } from 'typeorm';
import { CreateRightAssignmentTokenDto } from './dto/create-right-assignment-token.dto';
import { UpdateRightAssignmentTokenDto } from './dto/update-right-assignment-token.dto';
import { RightAssignmentTokenEntity } from './entities/right-assignment-token.entity';

@Injectable()
export class RightAssignmentTokensService {
  async findForText(id: string) {
    const tokens = await this.rightTokensRepository.find({
      where: { text: { id } },
    });
    return tokens;
  }
  constructor(
    @InjectRepository(RightAssignmentTokenEntity)
    private rightTokensRepository: Repository<RightAssignmentTokenEntity>,
    @InjectRepository(PermissionEntity)
    private permissionRepository: Repository<PermissionEntity>,
    @InjectRepository(TextEntity)
    private textRepository: Repository<TextEntity>,
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

    if (find.text.user.id == userId) {
      throw new HttpException(
        'Пользователь владеет текстом!',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    const permission = await this.permissionRepository.find({
      where: {
        user: userId,
        text: find.text,
      },
    });

    if (permission) {
      throw new HttpException(
        'У вас уже активировано разрешение',
        HttpStatus.FORBIDDEN,
      );
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

  async remove(id: string) {
    const find = await this.rightTokensRepository.findOne(id);
    if (!find) {
      throw new NotFoundException('Токен не найден');
    }
    return this.rightTokensRepository.delete(id);
  }
}
