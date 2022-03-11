import { SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class AppGateway {

  @WebSocketServer() wss: Server

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: any): void {
    this.wss.emit('msgFromServer', payload)
    //return {event: 'a',data: 'Hello world'};
  }
}
