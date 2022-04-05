import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionEntity } from 'src/permissions/entities/permission.entity';
import { RoomsService } from 'src/rooms/rooms.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateTextDto } from './dto/create-text.dto';
import { UpdateTextDto } from './dto/update-text.dto';
import { TextEntity } from './entities/text.entity';

@Injectable()
export class TextService {
  constructor(
    @InjectRepository(TextEntity)
    private textRepository: Repository<TextEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(PermissionEntity)
    private permissionRepository: Repository<PermissionEntity>,
    private roomService: RoomsService,
  ) {}

  async shared(userId: number) {
    const myPermissions = await this.permissionRepository
      .createQueryBuilder('perm')
      .leftJoinAndSelect('perm.text', 'text')
      .leftJoinAndSelect('perm.user', 'user')
      .where('perm.user = :userId', { userId })
      .select(['text', 'text.user', 'perm.permission'])
      .getMany();

    return myPermissions;
  }

  async findById(id: number) {
    const find = await this.textRepository.findOne(id);
    if (!find) {
      throw new NotFoundException('Текст не найден');
    }
    return find;
  }
  async findByIdToEdit(textId: string, userId: number) {
    const textData = await this.textRepository.findOne(textId, {
      relations: ['user'],
    });

    if (!textData) {
      throw new NotFoundException('Текст не найден');
    }

    if (textData.user.id != userId) {
      // Проверяем доступ к тексту
      const permission = await this.permissionRepository.findOne({
        where: { user: { id: userId }, text: { id: textId } },
        relations: ['user', 'text'],
      });
      if (!permission || permission.permission !== 'edit') {
        throw new NotFoundException('Текст не найден');
      }
    }

    const roomData = this.roomService.getRoomData(textId); //Берем данные из комнаты

    if (!roomData.data) {
      // Если данных в комнате нет, ставим из бд
      roomData.data = textData;
      this.roomService.setRoomData(textId, textData);
    }
    return roomData;
  }

  async remove(id: number) {
    const find = await this.textRepository.findOne(id);
    if (!find) {
      throw new NotFoundException('Текст не найден');
    }
    return this.textRepository.delete(id);
  }
  private readonly logger = new Logger();

  async update(id: string, updateTextDto: UpdateTextDto, userId) {
    const text = this.textRepository.findOne(id);
    if (!text) {
      throw new NotFoundException('Текст не найден');
    }

    return this.textRepository.update(id, {
      title: updateTextDto.title,
      content: updateTextDto.content,
    });
  }

  async create(createTextDto: CreateTextDto, userId: number) {
    return this.textRepository.save({
      content: createTextDto.content,
      title: createTextDto.title,
      user: { id: userId },
    });
  }

  async getMine(userId: number) {
    return await this.textRepository.find({
      select: ['id', 'title', 'createdAt', 'updatedAt'],
      relations: ['user'],
      where: { user: { id: userId } },
    });
  }
}
