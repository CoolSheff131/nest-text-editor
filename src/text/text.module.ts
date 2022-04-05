import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AppGateway } from 'src/app.gateway';
import { PermissionEntity } from 'src/permissions/entities/permission.entity';
import { RoomsService } from 'src/rooms/rooms.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { TextEntity } from './entities/text.entity';
import { TextController } from './text.controller';
import { TextService } from './text.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TextEntity, UserEntity, PermissionEntity]),
  ],
  controllers: [TextController],
  providers: [TextService, AppGateway, RoomsService, UserService],
  exports: [TextService],
})
export class TextModule {}
