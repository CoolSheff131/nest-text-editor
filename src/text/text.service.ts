import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateTextDto } from './dto/create-text.dto';
import { TextEntity } from './entities/text.entity';

@Injectable()
export class TextService {
  private readonly logger = new Logger();

  constructor(
    @InjectRepository(TextEntity)
    private textRepository: Repository<TextEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(createTextDto: CreateTextDto, userId: number) {
    this.logger.debug(createTextDto);
    this.logger.debug(userId);
    const text = new TextEntity();
    text.content = createTextDto.content;
    text.title = createTextDto.title;
    text.user = await this.userRepository.findOne(userId);
    return this.textRepository.save(text);
  }

  async getMine(userId: number) {
    this.logger.debug(userId);
    return await this.textRepository.find({
      relations: ['user'],
      where: { user: { id: userId } },
    });
  }
}
