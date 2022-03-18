import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RoomsService {
  rooms = {};
  logger = new Logger();

  getRoomData(id: string) {
    this.logger.debug('GET_ROOM_DATA');
    this.logger.debug(this.rooms);
    if (this.rooms[id] === undefined) {
      this.rooms[id] = { data: undefined, users: [] };
    }
    this.logger.debug(this.rooms);
    return this.rooms[id];
  }

  joinUser(id: string, user: any) {
    this.logger.debug('JOIN_USER');
    this.logger.debug(this.rooms);
    if (this.rooms[id] === undefined) {
      this.rooms[id] = { data: undefined, users: [] };
      this.logger.debug(id);
    }
    this.rooms[id].users.push(user);
    this.logger.debug(this.rooms);
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
    this.logger.debug('SET');
    this.logger.debug(this.rooms);
    this.logger.debug(data);
    this.rooms[id].data = data;
    this.logger.debug(this.rooms);
  }
}
