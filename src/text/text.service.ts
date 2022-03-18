import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

    private roomService: RoomsService,
  ) {}

  async findById(id: number) {
    const find = await this.textRepository.findOne(id);
    if (!find) {
      throw new NotFoundException('Текст не найден');
    }
    return find;
  }
  async findByIdToEdit(id: string) {
    const textData = await this.textRepository.findOne(id);
    if (!textData) {
      throw new NotFoundException('Текст не найден');
    }
    const roomData = this.roomService.getRoomData(id);
    if (!roomData.data) {
      roomData.data = textData;
      this.roomService.setRoomData(id, textData);
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
    this.logger.debug(userId);
    return await this.textRepository.find({
      select: ['id', 'title', 'updatedAt'],
      relations: ['user'],
      where: { user: { id: userId } },
    });
  }
}
