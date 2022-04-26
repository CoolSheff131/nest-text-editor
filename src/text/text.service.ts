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
  async searchByName(userId: number, searchedName: string) {
    const all = await this.getAll(userId);
    const filtered = all.filter((text) =>
      text.text.title.includes(searchedName),
    );
    return filtered;
  }
  constructor(
    @InjectRepository(TextEntity)
    private textRepository: Repository<TextEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(PermissionEntity)
    private permissionRepository: Repository<PermissionEntity>,
    private roomService: RoomsService,
  ) {}

  async uploadTextPreview(id: string, file: any) {
    const url = `http://localhost:3000/text/${id}/preview/${file.filename}`;
    this.textRepository.update(id, { previewUrl: url });
    return { url };
  }

  async shared(userId: number) {
    const myPermissions = await this.permissionRepository
      .createQueryBuilder('perm')
      .leftJoinAndSelect('perm.text', 'text')
      .leftJoinAndSelect('perm.user', 'user')
      .where('perm.user = :userId', { userId })
      .select(['text', 'text.user', 'perm.permission'])
      .getMany();
    const textIds = myPermissions.map((perm) => {
      return perm.text.id;
    });
    console.log(textIds);

    const texts = await this.textRepository.findByIds(textIds);

    return myPermissions.map((perm) => {
      const text = texts.find((tex) => tex.id == perm.text.id);
      return {
        permission: perm.permission,
        text,
      };
    });
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
    let userPermission;
    if (textData.user.id != userId) {
      // Проверяем доступ к тексту
      const permission = await this.permissionRepository.findOne({
        where: { user: { id: userId }, text: { id: textId } },
        relations: ['user', 'text'],
      });
      console.log(permission);

      if (!permission) {
        throw new NotFoundException('Текст не найден');
      } else {
        userPermission = permission.permission;
      }
    } else {
      userPermission = 'owner';
    }

    const roomData = await this.roomService.getRoomData(textId); //Берем данные из комнаты

    if (!roomData.data) {
      // Если данных в комнате нет, ставим из бд
      roomData.data = textData;
      this.roomService.setRoomData(textId, textData);
    }
    return { ...roomData, userPermission };
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

  async getAll(userId: number) {
    const mine = await this.textRepository.find({
      relations: ['user'],
      where: { user: { id: userId } },
    });

    const mineWithPermission = mine.map((text) => {
      return { text, permission: 'owner' };
    });

    const shared = await this.shared(userId);
    const all = [...shared, ...mineWithPermission];
    return all;
  }
}
