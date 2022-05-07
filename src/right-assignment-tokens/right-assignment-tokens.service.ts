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
import { v4 as uuidv4 } from 'uuid';
import { isRFC3339 } from 'class-validator';

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

  async create(createRightAssignmentTokenDto: CreateRightAssignmentTokenDto) {
    const token = uuidv4();
    const textId = createRightAssignmentTokenDto.textId;
    const permission = createRightAssignmentTokenDto.permission;
    if (createRightAssignmentTokenDto.isConstant) {
      const rightAssignment = await this.rightTokensRepository.findOne({
        where: { text: { id: textId }, isConstant: true, permission },
      });
      if (!rightAssignment) {
        await this.rightTokensRepository.save({
          permission: permission,
          text: { id: textId },
          token,
          isConstant: true,
        });
      } else {
        this.rightTokensRepository.update(rightAssignment, { token });
      }
    } else
      await this.rightTokensRepository.save({
        permission: permission,
        text: { id: textId },
        token,
        isConstant: false,
      });
    return;
  }

  async activate(userId: number, token: string) {
    const rightAssignmentToken = await this.rightTokensRepository.findOne({
      where: {
        token,
      },
      relations: ['text'],
    });
    if (!rightAssignmentToken) {
      throw new NotFoundException('Токен не найден');
    }

    if (rightAssignmentToken.text.user.id == userId) {
      throw new HttpException(
        'Пользователь владеет текстом!',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    const permission = await this.permissionRepository.find({
      where: {
        user: userId,
        text: rightAssignmentToken.text,
      },
    });

    if (permission.length !== 0) {
      throw new HttpException(
        'У вас уже активировано разрешение',
        HttpStatus.FORBIDDEN,
      );
    }

    this.permissionRepository.save({
      user: { id: userId },
      text: rightAssignmentToken.text,
      permission: rightAssignmentToken.permission,
    });
    if (!rightAssignmentToken.isConstant) {
      this.rightTokensRepository.delete(rightAssignmentToken);
    }
    return;
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
