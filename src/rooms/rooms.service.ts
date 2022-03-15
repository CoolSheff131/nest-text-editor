import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RoomsService {
  rooms = {};

  getRoomData(id: string) {
    if (this.rooms[id] === undefined) {
      this.rooms[id] = { data: '' };
    }
    return this.rooms[id].data;
  }

  setRoomData(id: string, data: any) {
    this.rooms[id].data = data;
  }
}
