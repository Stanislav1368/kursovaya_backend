import { Module } from "@nestjs/common";
import { InvitationService } from "./invitation.service";
import { InvitationController } from "./invitation.controller";
import { SocketService } from "src/socket.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "src/users/user.model";
import { Invitation } from "./invitation.model";

@Module({
  providers: [InvitationService, SocketService],
  controllers: [InvitationController],
  imports: [SequelizeModule.forFeature([User, Invitation])],
  exports: [InvitationService],
})
export class InvitationModule {}
