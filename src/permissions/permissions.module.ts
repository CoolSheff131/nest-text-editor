import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { PermissionEntity } from 'src/permissions/entities/permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TextEntity } from 'src/text/entities/text.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PermissionEntity, TextEntity, UserEntity]),
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService],
})
export class PermissionsModule {}
