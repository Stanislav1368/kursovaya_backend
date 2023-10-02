import { Module } from "@nestjs/common";
import { BoardsService } from "./boards.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "src/users/user.model";

import { Board } from "./boards.model";
import { BoardsController } from "./boards.controller";
import { UserBoards } from "./user-boards.model";

@Module({
  controllers: [BoardsController],
  providers: [BoardsService],
  imports: [SequelizeModule.forFeature([User, Board, UserBoards])],
  exports: [BoardsService],
})
export class BoardsModule {}
