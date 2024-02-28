import { Module } from "@nestjs/common";
import { BoardsService } from "./boards.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "src/users/user.model";

import { Board } from "./boards.model";
import { BoardsController } from "./boards.controller";
import { UserBoards } from "./user-boards.model";
import { StatesModule } from "src/states/states.module";
import { RolesService } from "src/roles/roles.service";
import { State } from "src/states/states.model";
import { Task } from "src/tasks/tasks.model";

@Module({
  controllers: [BoardsController],
  providers: [BoardsService],
  imports: [
    SequelizeModule.forFeature([User, Board, State, UserBoards]),
    StatesModule
  ],
  exports: [BoardsService],
})
export class BoardsModule {}
