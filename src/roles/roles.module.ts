import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/user.model';
import { Board } from 'src/boards/boards.model';
import { State } from 'src/states/states.model';
import { Task } from 'src/tasks/tasks.model';
import { UserBoards } from 'src/boards/user-boards.model';
import { Role } from './roles.model';

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [
    SequelizeModule.forFeature([Role, Board, UserBoards]),
    RolesModule
  ],
  exports: [
    RolesService
  ]
})
export class RolesModule {}
