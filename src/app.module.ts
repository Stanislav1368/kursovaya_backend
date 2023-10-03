import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UsersModule } from './users/users.module';
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


@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`
        }),
        SequelizeModule.forRoot({
          dialect: 'postgres',
          host: process.env.POSTGRES_HOST,
          port: Number(process.env.POSTGRES_PORT),
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DB,
          models: [User, Board, UserBoards, State, Task ],
          autoLoadModels: true,
          synchronize: true,
        }),
        UsersModule,
        AuthModule,
        BoardsModule,
        StatesModule,
        TasksModule
              ],
})
export class AppModule {}