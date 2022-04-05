import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RoomsService {
  rooms = {};
  logger = new Logger();
  getRoomData(id: string) {
    if (this.rooms[id] === undefined) {
      this.rooms[id] = { data: undefined, users: [] };
    }
    return this.rooms[id];
  }

  joinUser(id: string, user: any) {
    if (this.rooms[id] === undefined) {
      this.rooms[id] = { data: undefined, users: [] };
    }
    this.rooms[id].users.push(user);
  }

  leftUser(id: string, leftUser: any) {
    if (this.rooms[id] === undefined) {
      this.rooms[id] = { data: undefined, users: [] };
    }
    this.rooms[id].users = this.rooms[id].users.filter(
      (user) => user.id !== leftUser.id,
    );
  }

  setRoomData(id: string, data: any) {
    if (this.rooms[id] === undefined) {
      this.rooms[id] = { data: undefined, users: [] };
    }
    this.rooms[id].data = data;
  }
}
