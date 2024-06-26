import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';

import { AuthModule } from 'src/auth/auth.module';
import { Board } from 'src/boards/boards.model';
import { UserBoards } from 'src/boards/user-boards.model';
import { BoardsController } from 'src/boards/boards.controller';
import { BoardsService } from 'src/boards/boards.service';
import { Role } from 'src/roles/roles.model';
import { UserTasks } from 'src/tasks/user-tasks.model';
import { StatesModule } from 'src/states/states.module';
import { Comments } from 'src/tasks/comments.model';
import { SocketService } from 'src/socket.service';


@Module({
  controllers: [UsersController, BoardsController],
  providers: [UsersService, BoardsService, SocketService],
  imports: [
    SequelizeModule.forFeature([User, Board, UserBoards, UserTasks, Role, Comments]),
    forwardRef(() => AuthModule), StatesModule
  ],
  exports: [UsersService],
})
export class UsersModule {}
