import { Logger, UseGuards } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { WsGuard } from './auth/guards/WsGuard';
import { RoomsService } from './rooms/rooms.service';
import { TextEntity } from './text/entities/text.entity';
import { TextService } from './text/text.service';
import { UserEntity } from './user/entities/user.entity';

@WebSocketGateway({ cors: true })
export class AppGateway {
  logger = new Logger();
  constructor(
    private readonly roomsService: RoomsService,
    private readonly textService: TextService,
  ) {}
  @WebSocketServer() wss: Server;

  @UseGuards(WsGuard)
  @SubscribeMessage('msgToServer')
  handleMessage(
    client: Socket,
    message: { textId: string; text: string },
  ): void {
    client.broadcast.to(message.textId).emit('msgFromServer', message.text);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('joinRoom')
  async handleJoin(
    client: Socket,
    message: { textId: string; user: UserEntity },
  ) {
    client.join(message.textId);

    this.roomsService.joinUser(message.textId, message.user);
    client.broadcast.to(message.textId).emit('sendDataToJoinedUser');
    console.log('join');
    console.log(message.textId);

    const roomData = await this.roomsService.getRoomData(message.textId);

    if (roomData.users.length == 1) {
      console.log('123');

      const text = await this.textService.findByIdToEdit(
        message.textId,
        message.user.id,
      );
      console.log(text);

      console.log('321');
      this.wss.to(message.textId).emit('getTextInRoom', text.data);
    }

    this.wss.to(message.textId).emit('joinedRoom', roomData.users);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('sendTextInRoom')
  async handleSendToJoined(client: Socket, message: { text: TextEntity }) {
    let text = message.text;
    console.log(message);

    this.wss.to('' + message.text.id).emit('getTextInRoom', text);
  }

  @UseGuards(WsGuard)
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
