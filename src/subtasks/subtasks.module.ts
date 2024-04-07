import { Module } from "@nestjs/common";
import { SubTask } from "./subtasks.model";
import { Task } from "src/tasks/tasks.model";
import { SequelizeModule } from "@nestjs/sequelize";
import { SubTasksService } from "./subtasks.service";
import { SubTasksController } from "./subtasks.controller";
import { State } from "src/states/states.model";
import { Board } from "src/boards/boards.model";
import { User } from "src/users/user.model";
import { SocketService } from "src/socket.service";

@Module({
  controllers: [SubTasksController],
  providers: [SubTasksService, SocketService],
  imports: [SequelizeModule.forFeature([Task, SubTask, User, Board, State])],
  exports: [SubTasksService],
})
export class SubTasksModule {}
