import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AppGateway } from 'src/app.gateway';
import { RoomsService } from 'src/rooms/rooms.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { TextEntity } from './entities/text.entity';
import { TextController } from './text.controller';
import { TextService } from './text.service';

@Module({
  imports: [TypeOrmModule.forFeature([TextEntity, UserEntity])],
  controllers: [TextController],
  providers: [TextService, AppGateway, RoomsService],
  exports: [TextService],
})
export class TextModule {}
