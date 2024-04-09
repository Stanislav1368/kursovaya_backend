import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UsersModule } from "./users/users.module";
import { ConfigModule } from "@nestjs/config";
import { User } from "./users/user.model";
import { Board } from "./boards/boards.model";
import { BoardsModule } from "./boards/boards.module";
import { AuthModule } from "./auth/auth.module";
import { UserBoards } from "./boards/user-boards.model";
import { StatesModule } from "./states/states.module";
import { TasksModule } from "./tasks/tasks.module";
import { State } from "./states/states.model";
import { Task } from "./tasks/tasks.model";
import { RolesModule } from "./roles/roles.module";
import { Role } from "./roles/roles.model";
import { UserTasks } from "./tasks/user-tasks.model";
import { PrioritiesModule } from "./priorities/priorities.module";
import { Priority } from "./priorities/priorities.model";
import { SocketService } from "./socket.service";
import { Comments } from "./tasks/comments.model";
import { NotificationsModule } from "./notification/notifications.module";
import { Notification } from "./notification/notifications.model";
import { SubTask } from "./subtasks/subtasks.model";
import { SubTasksModule } from "./subtasks/subtasks.module";
import { InvitationModule } from './invitation/invitation.module';
import { Invitation } from "./invitation/invitation.model";

@Module({
  controllers: [],
  providers: [SocketService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Board, UserBoards, UserTasks, State, Task, SubTask, Role, Priority, Comments, Notification, Invitation],
      autoLoadModels: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    BoardsModule,
    StatesModule,
    TasksModule,
    RolesModule,
    PrioritiesModule, NotificationsModule, SubTasksModule, InvitationModule
  ],
})
export class AppModule {}
