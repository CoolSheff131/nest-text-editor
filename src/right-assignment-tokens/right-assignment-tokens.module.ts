import { Module } from '@nestjs/common';
import { RightAssignmentTokensService } from './right-assignment-tokens.service';
import { RightAssignmentTokensController } from './right-assignment-tokens.controller';
import { RightAssignmentTokenEntity } from './entities/right-assignment-token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEntity } from 'src/permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RightAssignmentTokenEntity, PermissionEntity]),
  ],
  controllers: [RightAssignmentTokensController],
  providers: [RightAssignmentTokensService],
})
export class RightAssignmentTokensModule {}
