import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserEntity } from './user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TextModule } from './text/text.module';
import { TextEntity } from './text/entities/text.entity';
import { PermissionsModule } from './permissions/permissions.module';
import { PermissionEntity } from './permissions/entities/permission.entity';
import { RightAssignmentTokensModule } from './right-assignment-tokens/right-assignment-tokens.module';
import { RightAssignmentTokenEntity } from './right-assignment-tokens/entities/right-assignment-token.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/api*'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', //'postgres-db',
      port: 5432,
      username: 'texteditor',
      password: 'texteditor',
      database: 'texteditor',
      entities: [
        UserEntity,
        TextEntity,
        PermissionEntity,
        RightAssignmentTokenEntity,
      ],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    TextModule,
    PermissionsModule,
    RightAssignmentTokensModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
