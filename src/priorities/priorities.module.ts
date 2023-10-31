import { Module } from "@nestjs/common";
import { PrioritiesController } from "./priorities.controller";
import { PrioritiesService } from "./priorities.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "src/users/user.model";
import { Board } from "src/boards/boards.model";
import { State } from "src/states/states.model";
import { Task } from "src/tasks/tasks.model";
import { UserBoards } from "src/boards/user-boards.model";
import { Priority } from "./priorities.model";

@Module({
  controllers: [PrioritiesController],
  providers: [PrioritiesService],
  imports: [SequelizeModule.forFeature([Priority, Board, UserBoards]), PrioritiesModule],
  exports: [PrioritiesService],
})
export class PrioritiesModule {}
