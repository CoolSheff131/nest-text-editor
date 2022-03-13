import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';
import { RoomsService } from './rooms/rooms.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, AppGateway, RoomsService],
})
export class AppModule {}
