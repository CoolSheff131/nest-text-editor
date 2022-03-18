import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { RoomsService } from './rooms/rooms.service';

@Controller()
export class AppController {
  constructor() {}
}
