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


@Module({
  controllers: [UsersController, BoardsController],
  providers: [UsersService, BoardsService],
  imports: [
    SequelizeModule.forFeature([User, Board, UserBoards]),
    forwardRef(() => AuthModule),
  ],
  exports: [UsersService],
})
export class UsersModule {}