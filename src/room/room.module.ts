import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Room } from "./entities/room.entity";
import { RoomService } from "./services/room.service";
import { RoomController } from "./room.controller";
import { RoomUser } from "./entities/room-user.entity";

@Module({
    imports: [
      TypeOrmModule.forFeature([Room,RoomUser])
    ],
    providers:[RoomService],
    controllers: [RoomController],
    exports:[RoomService]
  })
  export class RoomModule {}