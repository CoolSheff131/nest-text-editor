import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { RoomsService } from './rooms/rooms.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly roomsService: RoomsService,
  ) {}

  @Get('room/:id')
  getHello(@Param('id') id: string): string {
    return this.roomsService.getRoomData(id);
  }
}
