import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRightAssignmentTokenDto } from './dto/create-right-assignment-token.dto';
import { UpdateRightAssignmentTokenDto } from './dto/update-right-assignment-token.dto';
import { RightAssignmentTokenEntity } from './entities/right-assignment-token.entity';

@Injectable()
export class RightAssignmentTokensService {
  constructor(
    @InjectRepository(RightAssignmentTokenEntity)
    private rightTokensrepository: Repository<RightAssignmentTokenEntity>,
  ) {}

  create(createRightAssignmentTokenDto: CreateRightAssignmentTokenDto) {
    return this.rightTokensrepository.save(createRightAssignmentTokenDto);
  }

  findAll() {
    return this.rightTokensrepository.find();
  }

  findOne(id: number) {
    return this.rightTokensrepository.findOne(id);
  }

  update(
    id: number,
    updateRightAssignmentTokenDto: UpdateRightAssignmentTokenDto,
  ) {
    const find = this.rightTokensrepository.findOne(id);
    if (!find) {
      throw new NotFoundException('Токен не найден');
    }

    return this.rightTokensrepository.update(id, updateRightAssignmentTokenDto);
  }

  remove(id: number) {
    const find = this.rightTokensrepository.findOne(id);
    if (!find) {
      throw new NotFoundException('Токен не найден');
    }
    return this.rightTokensrepository.delete(id);
  }
}
