import { SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomsService } from './rooms/rooms.service';

@WebSocketGateway({ cors: true })
export class AppGateway {

  constructor(private readonly roomsService: RoomsService){}
  @WebSocketServer() wss: Server

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, message: {textId: string, text: string}): void {
    this.roomsService.setRoomData(message.textId, message.text)
    this.wss.to(message.textId).emit('msgFromServer', message.text)
    //return {event: 'a',data: 'Hello world'};
  }

  @SubscribeMessage('joinRoom')
  handleJoin(client: Socket, message: {textId: string, user: string}){
    client.join(message.textId)
    this.wss.to(message.textId).emit('joinedRoom', `${message.user} joined`)
  }

  @SubscribeMessage('leaveRoom')
  handleLeft(client: Socket, message: {textId: string, user: string}){
    client.leave(message.textId)
    this.wss.to(message.textId).emit('leftRoom', `${message.user} left`)
  }
}
