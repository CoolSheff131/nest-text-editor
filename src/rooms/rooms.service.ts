import { Injectable, Logger } from '@nestjs/common';
import { TextEntity } from 'src/text/entities/text.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

interface Room {
  id: string;
  usersId: Set<number>;
}

@Injectable()
export class RoomsService {
  rooms: Room[] = [];
  logger = new Logger();
  constructor(private readonly userService: UserService) {}

  findRoom(id: string): Room {
    let findedRoom: Room = this.rooms.find((room) => room.id === id);
    if (!findedRoom) {
      findedRoom = { id, usersId: new Set() };
      this.rooms.push(findedRoom);
    }
    return findedRoom;
  }

  async getRoomData(id: string) {
    const { usersId, ...room } = this.findRoom(id);
    let roomData = { ...room, users: [] };
    for (let userId of usersId) {
      let user = await this.userService.findById(userId);
      roomData.users.push(user);
    }

    return roomData;
  }

  joinUser(id: string, user: UserEntity) {
    const room = this.findRoom(id);
    room.usersId.add(user.id);
  }

  leftUser(id: string, leftUser: UserEntity) {
    let room = this.findRoom(id);
    room.usersId.delete(leftUser.id);
    if (room.usersId.size == 0) {
      this.rooms = this.rooms.filter((r) => r.id !== room.id);
    }
  }
}
