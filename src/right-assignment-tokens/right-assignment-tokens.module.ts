import { Module } from '@nestjs/common';
import { RightAssignmentTokensService } from './right-assignment-tokens.service';
import { RightAssignmentTokensController } from './right-assignment-tokens.controller';
import { RightAssignmentTokenEntity } from './entities/right-assignment-token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEntity } from 'src/permissions/entities/permission.entity';
import { TextEntity } from 'src/text/entities/text.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RightAssignmentTokenEntity,
      PermissionEntity,
      TextEntity,
    ]),
  ],
  controllers: [RightAssignmentTokensController],
  providers: [RightAssignmentTokensService],
})
export class RightAssignmentTokensModule {}
