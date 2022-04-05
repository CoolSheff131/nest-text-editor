import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomsService } from './rooms/rooms.service';
import { UserEntity } from './user/entities/user.entity';

@WebSocketGateway({ cors: true })
export class AppGateway {
  logger = new Logger();
  constructor(private readonly roomsService: RoomsService) {}
  @WebSocketServer() wss: Server;

  @SubscribeMessage('msgToServer')
  handleMessage(
    client: Socket,
    message: { textId: string; text: string },
  ): void {
    this.roomsService.setRoomData(message.textId, message.text);
    this.wss.to(message.textId).emit('msgFromServer', message.text);
    //return {event: 'a',data: 'Hello world'};
  }

  @SubscribeMessage('joinRoom')
  async handleJoin(
    client: Socket,
    message: { textId: string; user: UserEntity },
  ) {
    client.join(message.textId);

    this.roomsService.joinUser(message.textId, message.user);
    const roomData = await this.roomsService.getRoomData(message.textId);
    this.wss.to(message.textId).emit('joinedRoom', roomData.users);
  }

  @SubscribeMessage('leaveRoom')
  async handleLeft(
    client: Socket,
    message: { textId: string; user: UserEntity },
  ) {
    client.leave(message.textId);
    this.roomsService.leftUser(message.textId, message.user);
    const roomData = await this.roomsService.getRoomData(message.textId);
    this.wss.to(message.textId).emit('leftRoom', roomData.users);
  }
}
