import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}
  private readonly logger = new Logger();
  create(createUserDto: CreateUserDto) {
    this.logger.debug('CreateUserDto: ', createUserDto);
    return this.repository.save(createUserDto);
  }

  async findAll() {
    const arr = await this.repository.find();
    return arr;
  }

  async findById(id: number) {
    const find = await this.repository.findOne(+id);
    if (!find) {
      throw new NotFoundException('Статья не найдена');
    }
    return find;
  }
  async findByCond(cond: LoginUserDto) {
    const find = await this.repository.findOne(cond);
    if (!find) {
      throw new NotFoundException('Статья не найдена');
    }
    return find;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const find = await this.repository.findOne(+id);
    if (!find) {
      throw new NotFoundException('Статья не найдена');
    }
    return this.repository.update(id, updateUserDto);
  }

  async remove(id: number) {
    const find = await this.repository.findOne(+id);
    if (!find) {
      throw new NotFoundException('Статья не найдена');
    }
    return this.repository.delete(id);
  }

  async search(dto: SearchUserDto) {
    const qb = this.repository.createQueryBuilder('u');
    qb.limit(dto.limit || 0);
    qb.take(dto.take || 10);

    if (dto.fullname) {
      qb.andWhere(`u.fullname ILIKE :fullname`);
    }
    if (dto.email) {
      qb.andWhere(`u.email ILIKE :email`);
    }
    qb.setParameters({
      email: `%${dto.email}%`,
      fullname: `%${dto.fullname}%`,
    });
    const [items, total] = await qb.getManyAndCount();
    return { items, total };
  }
}
