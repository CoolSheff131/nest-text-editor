import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RoomsService {
    rooms = {}
    private readonly logger = new Logger();
    getRoomData(id: string){
        this.logger.debug(id)
        this.logger.debug(this.rooms[id])
        if(this.rooms[id] === undefined){
            this.rooms[id] = { data: ''}
            this.logger.debug('this.rooms')
        }
        this.logger.debug(this.rooms)
        return this.rooms[id].data
    }

    setRoomData(id: string, data: any){
        this.rooms[id].data = data
    }

}
