import { Module } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "src/users/user.model";
import { Board } from "src/boards/boards.model";
import { TasksController } from "./tasks.controller";
import { Task } from "./tasks.model";
import { State } from "src/states/states.model";
import { UserTasks } from "./user-tasks.model";
import { SocketService } from "src/socket.service";

@Module({
  controllers: [TasksController],
  providers: [TasksService, SocketService],
  imports: [SequelizeModule.forFeature([User, Board, State, Task, UserTasks])],
  exports: [TasksService],
})
export class TasksModule {}
