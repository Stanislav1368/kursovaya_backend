import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "src/users/user.model";
import { NotificationsController } from "./notifications.controller";
import { NotificationsService } from "./notifications.service";
import { Notification } from "./notifications.model";
import { SocketService } from "src/socket.service";

@Module({
  providers: [NotificationsService, SocketService],
  controllers: [NotificationsController],
  imports: [SequelizeModule.forFeature([User, Notification])],
  exports: [NotificationsService],
})
export class NotificationsModule {}
