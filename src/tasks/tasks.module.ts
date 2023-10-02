import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/user.model';
import { Board } from 'src/boards/boards.model';
import { TasksController } from './tasks.controller';
import { Task } from './tasks.model';
import { State } from 'src/states/states.model';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [
    SequelizeModule.forFeature([User, Board, State, Task])
  ],
  exports: [
    TasksService
  ]
})
export class TasksModule {}
